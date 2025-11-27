export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabaseAdmin'

export async function GET(req: Request) {
    try {
        const supabase = getAdminClient()

        const { data, error } = await supabase
            .from('survey_participants')
            .select('*')
            .order('submitted_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ participants: data })

    } catch (e: any) {
        return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
    }
}
