// app/api/admin/users/[userId]/route.ts
import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabaseAdmin'

const stripPII = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj
    const deny = new Set(['email', 'name', 'display_name', 'phone', 'tel', 'id_card', 'citizen_id'])
    if (Array.isArray(obj)) return obj.map(stripPII)
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(obj)) if (!deny.has(k)) out[k] = stripPII(v)
    return out
}
const toInt = (x: any) => {
    const n = parseInt(String(x ?? '0'), 10)
    return Number.isFinite(n) ? n : 0
}

export async function GET(
    _req: Request,
    ctx: { params: Promise<{ userId: string }> }   // 👈 เปลี่ยนเป็น Promise
) {
    try {
        const { userId: sessionId } = await ctx.params   // 👈 ต้อง await
        const supabase = getAdminClient()

        const { data: s, error } = await supabase
            .from('survey_sessions')
            .select('id, form_id, form_slug, form_version, started_at, submitted_at, completed_at, is_completed, status, progress, answers')
            .eq('id', sessionId)
            .single()

        if (error) return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })

        const a: any = s?.answers ?? {}
        const stress =
            toInt(a['st5_q1']) + toInt(a['st5_q2']) + toInt(a['st5_q3']) + toInt(a['st5_q4']) + toInt(a['st5_q5'])

        return NextResponse.json({
            summary: {
                sessionId: s.id,
                formId: s.form_id,
                formSlug: s.form_slug,
                version: s.form_version ?? null,
                startedAt: s.started_at,
                finishedAt: s.submitted_at ?? s.completed_at ?? null,
                isCompleted: s.is_completed,
                status: s.status,
                progress: s.progress,
                gender: a.gender ?? null,
                yearLevel: a.year_level ?? null,
                age: a.age ?? null,
                department: a.current_department ?? null,
                stress,
                bmi: a?._computed?.bmi ?? null,
                bsa: a?._computed?.bsa ?? null,
                bmiStatus: a?._computed?.bmi_status ?? null,
                bsaStatus: a?._computed?.bsa_status ?? null,
            },
            answers: stripPII(a),
        })
    } catch (e: any) {
        return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
    }
}
