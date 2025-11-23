import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
)

const MAP: Record<string, { view: string; label: string }> = {
    sweet: { view: 'v_monthly_sweet_avg', label: 'หวาน' },
    fat: { view: 'v_monthly_fat_avg', label: 'ไขมัน' },
    sodium: { view: 'v_monthly_sodium_avg', label: 'โซเดียม' },
    stress: { view: 'v_monthly_stress_avg', label: 'ความเครียด (ST5)' },
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const topic = (searchParams.get('topic') || '').toLowerCase()

    if (!MAP[topic]) {
        return NextResponse.json({ error: 'invalid topic' }, { status: 400 })
    }

    const view = MAP[topic].view
    const { data, error } = await supabaseAdmin.from(view)
        .select('month, avg')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
        topic,
        label: MAP[topic].label,
        items: (data ?? []).map((r: any) => ({ month: r.month, avg: Number(r.avg) }))
    })
}
