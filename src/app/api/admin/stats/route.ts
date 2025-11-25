export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabaseAdmin'

// Helper to calculate ST5 score
const calculateStress = (answers: any) => {
    const keys = ['st5_q1', 'st5_q2', 'st5_q3', 'st5_q4', 'st5_q5'] as const
    return keys.reduce((total, key) => {
        const val = parseInt(String(answers?.[key] ?? 0), 10)
        return total + (Number.isFinite(val) ? val : 0)
    }, 0)
}

// Helper to determine stress level
const getStressLevel = (score: number) => {
    if (score <= 4) return 'Low'
    if (score <= 7) return 'Moderate'
    if (score <= 9) return 'High'
    return 'Severe'
}

export async function GET(req: Request) {
    try {
        const supabase = getAdminClient()

        // Fetch all completed sessions with answers
        const { data, error } = await supabase
            .from('survey_sessions')
            .select('id, answers')
            .not('answers', 'is', null)

        if (error) throw error

        const items = (data ?? []).map((session: any) => {
            const answers = session.answers ?? {}
            const score = calculateStress(answers)
            const level = getStressLevel(score)
            const yearLevel = answers.year_level ? String(answers.year_level) : 'Unknown'

            return {
                id: session.id,
                score,
                level,
                yearLevel
            }
        })

        // Calculate distribution
        const distribution = {
            Low: 0,
            Moderate: 0,
            High: 0,
            Severe: 0
        }

        items.forEach(item => {
            if (item.level in distribution) {
                distribution[item.level as keyof typeof distribution]++
            }
        })

        return NextResponse.json({
            total: items.length,
            distribution,
            items // Sending all items to client for flexible filtering
        })

    } catch (e: any) {
        return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
    }
}
