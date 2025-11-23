export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabaseAdmin'

// รวมคะแนนเครียดจากคำตอบใน answers
const sumStress = (a: any) =>
    (['st5_q1', 'st5_q2', 'st5_q3', 'st5_q4', 'st5_q5'] as const)
        .reduce((t, k) => {
            const n = parseInt(String(a?.[k] ?? 0), 10)
            return t + (Number.isFinite(n) ? n : 0)
        }, 0)

export async function GET(req: Request) {
    try {
        const supabase = getAdminClient()

        const { searchParams } = new URL(req.url)
        const q = (searchParams.get('q') ?? '').trim()
        const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
        const size = Math.min(100, Math.max(1, Number(searchParams.get('size') ?? '10')))
        const from = (page - 1) * size
        const to = from + size - 1

        let query = supabase
            .from('survey_sessions')
            .select(
                'id, form_id, form_slug, started_at, submitted_at, completed_at, is_completed, answers',
                { count: 'exact' }
            )
            .order('started_at', { ascending: false })
            .range(from, to)

        if (q) query = query.ilike('form_slug', `%${q}%`)

        const { data, count, error } = await query
        if (error) return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })

        const items = (data ?? []).map((s: any) => {
            const a = s.answers ?? {}
            return {
                userId: s.id,                                  // ใช้ session id เป็นตัวแทนผู้ใช้ (ไม่เปิดเผยตัวตน)
                name: a.display_name ?? s.form_slug ?? 'ผู้ใช้ไม่ระบุ',
                email: null,
                picture: null,
                sessionId: s.id,
                startedAt: s.started_at,
                finishedAt: s.submitted_at ?? s.completed_at ?? null,
                stress: sumStress(a),                          // ✅ รวม st5_q1..st5_q5
                department: a.current_department ?? null
            }
        })

        return NextResponse.json({
            meta: { totalUsers: count ?? items.length, page, size, count: count ?? items.length },
            items
        })
    } catch (e: any) {
        return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
    }
}
