import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,   // SERVER ONLY
    { auth: { persistSession: false } }
)

export async function GET() {
    // ใช้ view ที่รวม session ล่าสุดของแต่ละ user
    const { data: latest, error } = await supabaseAdmin
        .from('admin_user_latest')
        .select('last_session_id')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const sessionIds = (latest ?? [])
        .map(r => r.last_session_id)
        .filter(Boolean) as string[]

    // ไม่มีข้อมูล ก็ส่งศูนย์ทั้ง 4 หมวด
    if (sessionIds.length === 0) {
        return NextResponse.json({
            items: [
                { name: 'หวาน', value: 0 },
                { name: 'ไขมัน', value: 0 },
                { name: 'โซเดียม', value: 0 },
                { name: 'ความเครียด (ST5)', value: 0 },
                // เว้น "ทักษะความรู้" ไว้สำหรับอนาคต
            ]
        })
    }

    // 1) หวาน/ไขมัน/โซเดียม
    const { data: s3, error: e3 } = await supabaseAdmin
        .from('survey_section3')
        .select('sugar_score,fat_score,sodium_score')
        .in('session_id', sessionIds)
    if (e3) return NextResponse.json({ error: e3.message }, { status: 500 })

    const sugarSum = (s3 ?? []).reduce((a, r) => a + (r.sugar_score ?? 0), 0)
    const fatSum = (s3 ?? []).reduce((a, r) => a + (r.fat_score ?? 0), 0)
    const sodiumSum = (s3 ?? []).reduce((a, r) => a + (r.sodium_score ?? 0), 0)

    // 2) ความเครียด (ST5)
    const { data: s5, error: e5 } = await supabaseAdmin
        .from('survey_section5')
        .select('total_score')
        .in('session_id', sessionIds)
    if (e5) return NextResponse.json({ error: e5.message }, { status: 500 })

    const stressSum = (s5 ?? []).reduce((a, r) => a + (r.total_score ?? 0), 0)

    // ส่งเฉพาะ 4 หมวด
    return NextResponse.json({
        items: [
            { name: 'หวาน', value: sugarSum },
            { name: 'ไขมัน', value: fatSum },
            { name: 'โซเดียม', value: sodiumSum },
            { name: 'ความเครียด (ST5)', value: stressSum },
            // { name: 'ทักษะความรู้', value: 0 }, // <- ไว้เปิดใช้ในอนาคต
        ]
    })
}
