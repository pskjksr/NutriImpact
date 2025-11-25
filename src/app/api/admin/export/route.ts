import ExcelJS from 'exceljs'
import { getAdminClient } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// ---------- MAPPERS (เดิม) ----------
function mapWeightStatusEn(v: unknown): string | null {
    if (v == null) return null
    const s = String(v).trim()
    switch (s) {
        case 'น้ำหนักเกิน': return 'Overweight'
        case 'น้ำหนักปกติ': return 'Normal weight'
        case 'น้ำหนักน้อยกว่าปกติ': return 'Underweight'
        case 'ไม่แน่ใจ': return 'Unsure'
        default: return s
    }
}
function mapDailyFunctionEn(v: unknown): string | null {
    if (v == null) return null
    const s = String(v).trim()
    switch (s) {
        case 'เหนื่อยง่าย': return 'Easily fatigued'
        case 'ปกติ': return 'Normal'
        case 'กระตือรือร้น': return 'Energetic'
        case 'ผิดปกติ': return 'Abnormal'
        case 'ไม่แน่ใจ': return 'Unsure'
        default: return s
    }
}
function mapStressLevelEn(v: unknown): string | null {
    if (v == null) return null
    const s = String(v).trim()
    switch (s) {
        case 'ความเครียดน้อย': return 'Low'
        case 'ความเครียดปานกลาง': return 'Moderate'
        case 'ความเครียดมาก': return 'High'
        case 'ความเครียดมากที่สุด': return 'Very high'
        default: return s
    }
}
function mapYearLevel(g: unknown): 4 | 5 | 6 | null {
    if (g == null) return null
    const s = String(g).trim()
    if (s === 'ชั้นปีที่ 4' || s === '4') return 4
    if (s === 'ชั้นปีที่ 5' || s === '5') return 5
    if (s === 'ชั้นปีที่ 6' || s === '6') return 6
    return null
}
function mapGender(g: unknown): number | null {
    if (g == null) return null
    const s = String(g).trim().toLowerCase()
    if (['หญิง'].includes(s)) return 1
    if (['ชาย'].includes(s)) return 0
    if (s === '1' || s === '0') return Number(s)
    return null
}
function mapTri(v: unknown): 0 | 1 | 2 | null {
    if (v == null) return null
    if (typeof v === 'number') return (v === 0 || v === 1 || v === 2) ? v as 0 | 1 | 2 : null
    if (typeof v === 'boolean') return v ? 1 : 0
    const s = String(v).trim().toLowerCase()
    if (s === 'ไม่ใช่' || s === 'no' || s === 'false' || s === '0') return 0
    if (s === 'ใช่' || s === 'yes' || s === 'true' || s === '1') return 1
    if (s === 'ไม่แน่ใจ' || s === 'unsure' || s === 'not sure' || s === '2') return 2
    return null
}
function toDateOnly(iso?: string | null) {
    if (!iso) return null
    const d = new Date(iso)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}
const sumStress = (a: any) =>
    (['st5_q1', 'st5_q2', 'st5_q3', 'st5_q4', 'st5_q5'] as const)
        .reduce((t, k) => {
            const n = parseInt(String(a?.[k] ?? 0), 10)
            return t + (Number.isFinite(n) ? n : 0)
        }, 0)
function thaiStressLabelFromScore(total: number) {
    if (total >= 10) return 'ความเครียดมากที่สุด'
    if (total >= 8) return 'ความเครียดมาก'
    if (total >= 5) return 'ความเครียดปานกลาง'
    return 'ความเครียดน้อย'
}

// ---------- ใหม่: list → text (ไม่ใส่ " , [ ]) & diet score ----------
function listToText(v: unknown): string | null {
    if (v == null) return null
    if (Array.isArray(v)) {
        const items = v
            .map(x => (x == null ? '' : String(x).trim()))
            .filter(x => x !== '')
        return items.length ? items.join(' / ') : null   // ไม่มี comma/bracket/quote
    }
    return String(v)
}
function dietScore(v: unknown): number | null {
    if (v == null) return null
    const s = String(v).trim()
    if (s === 'ทุกวัน/เกือบทุกวัน') return 3
    if (s === '3-4 ครั้งต่อสัปดาห์') return 2
    if (s === 'แทบไม่ทำ/ไม่ทำเลย') return 1
    const n = parseInt(s, 10)
    return Number.isFinite(n) ? n : null
}
const sum = (arr: Array<number | null>) =>
    arr.reduce<number>((t, x) => t + (x ?? 0), 0)

// ---------- Excel helper ----------
// ---------- Excel helper ----------
function addSheet(wb: ExcelJS.Workbook, name: string, rows: any[]) {
    const ws = wb.addWorksheet(name)
    if (!rows || rows.length === 0) {
        ws.addRow(['No data'])
        return ws
    }
    const headers = Object.keys(rows[0] as Record<string, unknown>)
    ws.addRow(headers)
    rows.forEach((r) => ws.addRow(headers.map((h) => (r as any)[h])))
    ws.getRow(1).font = { bold: true }
    ws.columns?.forEach((_, idx) => {
        const col = ws.getColumn(idx + 1)
        let max = 10
        col.eachCell({ includeEmpty: true }, (cell) => {
            const len = String(cell.value ?? '').length
            if (len > max) max = len
        })
        col.width = Math.min(60, max + 2)
    })
    return ws
}

function mapToCode(v: string | null): string | null {
    if (v === null) return null
    const s = v.trim()
    if (s === 'ไม่มี') return '0'
    if (s === 'มี') return '1'
    if (s.startsWith('อื่น')) return s.replace(/^อื่นๆ?/, 'Others')
    return s
}

// ---------- Handler ----------
export async function GET(req: Request) {
    try {
        const supabase = getAdminClient()
        const { searchParams } = new URL(req.url)
        const q = (searchParams.get('q') ?? '').trim()

        let query = supabase
            .from('survey_sessions')
            .select('id, form_id, form_slug, form_version, started_at, submitted_at, completed_at, is_completed, answers')
            .order('started_at', { ascending: false })

        if (q) {
            query = query.or(
                `form_slug.ilike.%${q}%,answers->>current_department.ilike.%${q}%`
            )
        }

        const { data, error } = await query
        if (error) throw error

        const rows = (data ?? []).map((s: any) => {
            const a = s.answers ?? {}
            const doneAt = s.submitted_at ?? s.completed_at ?? null

            // diet scores + total
            const d31 = ['diet31_q1', 'diet31_q2', 'diet31_q3', 'diet31_q4', 'diet31_q5'].map(k => dietScore(a[k]))
            const d32 = ['diet32_q1', 'diet32_q2', 'diet32_q3', 'diet32_q4', 'diet32_q5'].map(k => dietScore(a[k]))
            const d33 = ['diet33_q1', 'diet33_q2', 'diet33_q3', 'diet33_q4', 'diet33_q5'].map(k => dietScore(a[k]))

            const stressTotal = sumStress(a)
            const stressLabelTh = a.stress_level ?? thaiStressLabelFromScore(stressTotal)

            return {
                // meta
                date_only: toDateOnly(doneAt),

                // ข้อมูลทั่วไป
                Department: a.current_department ?? null,
                Age: a.age ?? null,
                Gender: mapGender(a.gender),
                Grade: mapYearLevel(a.year_level),
                Height_cm: a.height_cm ?? null,
                Weight_kg: a.weight_kg ?? null,

                // ค่าคำนวณ
                BMI: a?._computed?.bmi ?? null,
                BSA: a?._computed?.bsa ?? null,

                // สุขภาพ & ผ่าตัด
                K41_Q1: mapTri(a.k41_q1),
                K41_Q2: mapTri(a.k41_q2),
                K41_Q3: mapTri(a.k41_q3),
                K41_Q4: mapTri(a.k41_q4),
                K41_Q5: mapTri(a.k41_q5),
                K41_Q6: mapTri(a.k41_q6),
                Self_weight_status: mapWeightStatusEn(a.k42 ?? a.self_weight_status),
                Daily_functioning: mapDailyFunctionEn(a.k43 ?? a.daily_functioning),
                Surgery_history: mapToCode(a.surgery_history ?? null),
                Surgery_detail: mapToCode(a.surgery_detail ?? null),

                // 🔥 ใหม่: ยาที่ใช้ประจำ/โรคประจำตัว — แปลง list → text (ไม่มี " , [ ])
                Regular_Medications: mapToCode(listToText(a.regular_medications)),
                Underlying_Diseases: mapToCode(listToText(a.underlying_diseases)),

                // พฤติกรรมการกิน (raw)
                // 🔥 ใหม่: คะแนนที่แปลงแล้ว + total
                Diet31_Q1_Score: d31[0], Diet31_Q2_Score: d31[1], Diet31_Q3_Score: d31[2], Diet31_Q4_Score: d31[3], Diet31_Q5_Score: d31[4],
                Diet31_Total_Score: sum(d31),

                Diet32_Q1_Score: d32[0], Diet32_Q2_Score: d32[1], Diet32_Q3_Score: d32[2], Diet32_Q4_Score: d32[3], Diet32_Q5_Score: d32[4],
                Diet32_Total_Score: sum(d32),

                Diet33_Q1_Score: d33[0], Diet33_Q2_Score: d33[1], Diet33_Q3_Score: d33[2], Diet33_Q4_Score: d33[3], Diet33_Q5_Score: d33[4],
                Diet33_Total_Score: sum(d33),

                // ST-5
                ST5_Q1: a.st5_q1 ?? null,
                ST5_Q2: a.st5_q2 ?? null,
                ST5_Q3: a.st5_q3 ?? null,
                ST5_Q4: a.st5_q4 ?? null,
                ST5_Q5: a.st5_q5 ?? null,
                Stress_Score: stressTotal,
                Stress_Level: mapStressLevelEn(stressLabelTh),
            }
        })

        const wb = new ExcelJS.Workbook()
        addSheet(wb, 'Nutritional', rows)

        const buffer = await wb.xlsx.writeBuffer()
        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="nutritional_export_${new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace(/[:T]/g, '-')}.xlsx"`,
                'Cache-Control': 'no-store',
            },
        })
    } catch (e: any) {
        console.error('export error:', e)
        return new Response(JSON.stringify({ error: e?.message ?? 'export failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
