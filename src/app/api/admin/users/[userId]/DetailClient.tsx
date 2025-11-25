// app/admin/users/[userId]/DetailClient.tsx
'use client'

import { JSX, useEffect, useMemo, useState } from 'react'

type Summary = {
    sessionId: string
    formId: string | null
    formSlug: string | null
    version: number | null
    startedAt: string | null
    finishedAt: string | null
    isCompleted: boolean | null
    status: string | null
    progress: number | null
    gender: string | null
    yearLevel: string | null
    age: number | null
    department: string | null
    stress: number | null
    bmi: number | null
    bsa: number | null
    bmiStatus: string | null
    bsaStatus: string | null
}

// ---------- ชื่อใหม่แบบ “กันพลาด” ด้วย regex ----------
const L31 = [
    '', // index 0 ไม่ใช้
    'ดื่มน้ำเปล่า',
    'ดื่มน้ำอัดลม กาแฟ ชา น้ำหวาน นมเปรี้ยว',
    'ดื่มน้ำผักผลไม้สำเร็จรูป',
    'กินไอศกรีม เบเกอรี่ หรือขนมหวานไทย',
    'เติมน้ำตาลเพิ่มลงในอาหาร',
]
const L32 = [
    '',
    'เลือกกินเนื้อสัตว์ไม่ติดมัน ไม่ติดหนัง',
    'กินอาหารทอด อาหารฟาสต์ฟู้ด อาหารผัดน้ำมัน',
    'กินอาหารจานเดียว ไขมันสูง หรืออาหารประเภทแกงกะทิ',
    'ดื่มเครื่องดื่มที่ผสมนมข้นหวาน ครีมเทียม วิปปิ้งครีม',
    'ซดน้ำผัก/น้ำแกง หรือ ราดน้ำผักน้ำแกงลงในข้าว',
]
const L33 = [
    '',
    'ชิมอาหารก่อนปรุง น้ำปลา ซีอิ๊ว ซอส',
    'กินอาหารที่มีสมุนไพรหรือเครื่องเทศ เป็นส่วนประกอบ',
    'กินเนื้อสัตว์แปรรูป ไส้กรอก หมูยอ แฮม ปลาทูเค็ม กุ้งแห้ง ปลาร้า',
    'กินอาหารสำเร็จรูปหรืออาหารแช่แข็ง',
    'กินผักผลไม้ดองหรือผลไม้แช่อิ่ม',
]

const ST5_RENAMES: Record<string, string> = {
    st5_q1: 'มีปัญหาการนอน นอนไม่หลับหรือนอนมาก',
    st5_q2: 'มีสมาธิลดลง',
    st5_q3: 'หงุดหงิด / กระวนกระวาย / ว้าวุ่นใจ',
    st5_q4: 'รู้สึกเบื่อ เซ็ง',
    st5_q5: 'ไม่อยากพบปะผู้คน',
}
const OTHER_RENAMES: Record<string, string> = {
    k41_q1: 'ไม่ทานอาหารขยะ',
    k41_q2: 'อ่านฉลากอาหาร',
    k41_q3: 'ทานอาหารเสริม',
    k41_q4: 'ติดตามการกินของตนเองและปริมาณอาหารที่กิน',
    k41_q5: 'ชั่งน้ำหนักและติดตามเป็นประจำ',
    k41_q6: 'กินตลอดทั้งวัน',
}

const norm = (s: string) => s.trim().toLowerCase()
const dietLabel = (k: string): string | null => {
    const m = /^diet(31|32|33)_q([1-5])$/i.exec(norm(k))
    if (!m) return null
    const grp = m[1]
    const idx = Number(m[2])
    const table = grp === '31' ? L31 : grp === '32' ? L32 : L33
    return table[idx] ?? null
}

export default function DetailClient({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [summary, setSummary] = useState<Summary | null>(null)
    const [answers, setAnswers] = useState<any>({})

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError(null)
        fetch(`/api/admin/users/${encodeURIComponent(userId)}`, { cache: 'no-store' })
            .then(async (r) => {
                const ct = r.headers.get('content-type') || ''
                const raw = await r.text()
                if (!ct.includes('application/json')) throw new Error(raw.slice(0, 200))
                const json = JSON.parse(raw)
                if (json.error) throw new Error(json.error)
                return json
            })
            .then((json) => {
                if (cancelled) return
                setSummary(json.summary ?? null)
                setAnswers(json.answers ?? {})
            })
            .catch((e) => !cancelled && setError(String(e.message || e)))
            .finally(() => !cancelled && setLoading(false))
        return () => { cancelled = true }
    }, [userId])

    const stressTotal = useMemo(() => {
        const ks = ['st5_q1', 'st5_q2', 'st5_q3', 'st5_q4', 'st5_q5']
        return ks.reduce((t, k) => t + (parseInt(String(answers?.[k] ?? 0), 10) || 0), 0)
    }, [answers])

    const groups = useMemo(() => {
        const picked = new Set<string>()
        const pick = (keys: string[]) =>
            keys.filter(k => answers?.[k] !== undefined).map(k => {
                picked.add(k)
                return [k, answers[k]] as const
            })

        const g = [
            { title: 'ข้อมูลทั่วไป', rows: pick(['gender', 'age', 'year_level', 'current_department', 'height_cm', 'weight_kg']) },
            { title: 'ยาและโรคประจำตัว', rows: pick(['regular_medications', 'underlying_diseases']) },
            { title: 'ประวัติการผ่าตัด', rows: pick(['surgery_history', 'surgery_detail']) },
            { title: 'สถานะสุขภาพ', rows: pick(['k41_q1', 'k41_q2', 'k41_q3', 'k41_q4', 'k41_q5', 'k41_q6', 'k42', 'k43']) },
            {
                title: 'แบบประเมินความเครียด (ST-5)',
                rows: pick(['st5_q1', 'st5_q2', 'st5_q3', 'st5_q4', 'st5_q5']).concat([['st5_total', stressTotal] as const]),
            },
            { title: 'พฤติกรรมการกิน 3.1', rows: pick(['diet31_q1', 'diet31_q2', 'diet31_q3', 'diet31_q4', 'diet31_q5']) },
            { title: 'พฤติกรรมการกิน 3.2', rows: pick(['diet32_q1', 'diet32_q2', 'diet32_q3', 'diet32_q4', 'diet32_q5']) },
            { title: 'พฤติกรรมการกิน 3.3', rows: pick(['diet33_q1', 'diet33_q2', 'diet33_q3', 'diet33_q4', 'diet33_q5']) },
            { title: 'คำนวณอัตโนมัติ', rows: Object.entries(answers?._computed ?? {}).map(([k, v]) => [k, v] as const) },
        ]

        const otherRows: Array<readonly [string, any]> = []
        for (const [k, v] of Object.entries(answers ?? {})) {
            if (k === '_computed') continue
            if (!picked.has(k)) otherRows.push([k, v] as const)
        }
        if (otherRows.length) g.push({ title: 'อื่น ๆ', rows: otherRows })
        return g.filter(sec => sec.rows.length > 0)
    }, [answers, stressTotal])

    // ---------- label ที่ “ต้องเปลี่ยนให้ได้” ----------
    const label = (k: string) => {
        const nk = norm(k)
        const dl = dietLabel(nk)
        if (dl) return dl
        if (ST5_RENAMES[nk]) return ST5_RENAMES[nk]
        if (OTHER_RENAMES[nk]) return OTHER_RENAMES[nk]

        const defaults: Record<string, string> = {
            gender: 'เพศ',
            age: 'อายุ',
            year_level: 'ชั้นปี',
            current_department: 'แผนก',
            height_cm: 'ส่วนสูง (ซม.)',
            weight_kg: 'น้ำหนัก (กก.)',
            regular_medications: 'ยาที่ใช้เป็นประจำ',
            underlying_diseases: 'โรคประจำตัว',
            surgery_history: 'ประวัติการผ่าตัด',
            surgery_detail: 'รายละเอียดการผ่าตัด',
            k42: 'ดัชนีมวลกาย (แปลผล)',
            k43: 'ความดันโลหิต (แปลผล)',
            st5_total: 'คะแนนเครียดรวม',
            // fallback เดิม
            diet31_q1: 'อาหาร 3.1–1', diet31_q2: 'อาหาร 3.1–2', diet31_q3: 'อาหาร 3.1–3', diet31_q4: 'อาหาร 3.1–4', diet31_q5: 'อาหาร 3.1–5',
            diet32_q1: 'อาหาร 3.2–1', diet32_q2: 'อาหาร 3.2–2', diet32_q3: 'อาหาร 3.2–3', diet32_q4: 'อาหาร 3.2–4', diet32_q5: 'อาหาร 3.2–5',
            diet33_q1: 'อาหาร 3.3–1', diet33_q2: 'อาหาร 3.3–2', diet33_q3: 'อาหาร 3.3–3', diet33_q4: 'อาหาร 3.3–4', diet33_q5: 'อาหาร 3.3–5',
            bmi: 'BMI', bsa: 'BSA', bmi_status: 'BMI (แปลผล)', bsa_status: 'BSA (แปลผล)',
        }
        const d = (defaults as any).__norm ?? ((defaults as any).__norm =
            Object.fromEntries(Object.entries(defaults).map(([kk, vv]) => [norm(kk), vv])))
        return d[nk] ?? k
    }

    const copyJson = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(answers ?? {}, null, 2))
            alert('คัดลอก JSON แล้ว')
        } catch {
            alert('คัดลอกไม่สำเร็จ')
        }
    }

    const downloadJson = () => {
        const blob = new Blob([JSON.stringify(answers ?? {}, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `answers_${summary?.sessionId ?? 'session'}.json`
        document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
    }

    if (loading) return <p className="text-gray-500 p-6">กำลังโหลด…</p>
    if (error) return <p className="text-red-600 p-6">โหลดไม่สำเร็จ: {error}</p>
    if (!summary) return <p className="p-6">ไม่พบข้อมูล</p>

    return (
        <div className="p-6 space-y-8">
            <div className="bg-white rounded-2xl shadow border p-6">
                <h2 className="text-xl font-bold mb-3">รายละเอียดแบบฟอร์ม</h2>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div><span className="text-gray-500">ฟอร์ม:</span> {summary.formSlug ?? '—'} (v{summary.version ?? '—'})</div>
                    <div><span className="text-gray-500">เริ่ม:</span> {summary.startedAt ? new Date(summary.startedAt).toLocaleString() : '—'}</div>
                    <div><span className="text-gray-500">เสร็จ:</span> {summary.finishedAt ? new Date(summary.finishedAt).toLocaleString() : '—'}</div>
                    <div><span className="text-gray-500">เพศ/ชั้นปี/แผนก:</span> {summary.gender ?? '—'} / {summary.yearLevel ?? '—'} / {summary.department ?? '—'}</div>
                    <div><span className="text-gray-500">BMI/BSA:</span> {summary.bmi ?? '—'} ({summary.bmiStatus ?? '—'}) / {summary.bsa ?? '—'} ({summary.bsaStatus ?? '—'})</div>
                    <div><span className="text-gray-500">คะแนนเครียดรวม:</span> <span className="font-semibold">{summary.stress ?? stressTotal}</span></div>
                </div>

                <div className="mt-4 flex gap-2">
                    <button onClick={copyJson} className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">คัดลอก JSON</button>
                    <button onClick={downloadJson} className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">ดาวน์โหลด JSON</button>
                </div>
            </div>

            {groups.map((sec) => (
                <div key={sec.title} className="bg-white rounded-2xl shadow border p-6">
                    <h3 className="font-semibold text-lg mb-3">{sec.title}</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <tbody>
                                {sec.rows.map(([k, v]) => (
                                    <tr key={k} className="border-t">
                                        <td className="py-2 pr-4 text-gray-600 w-56 align-top">{label(k)}</td>
                                        <td className="py-2 text-gray-800">{renderValue(v)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    )
}

// renderer
function renderValue(v: any): JSX.Element {
    if (v === null || v === undefined) return <span className="text-gray-400">—</span>
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return <span>{String(v)}</span>
    if (Array.isArray(v)) {
        if (v.length === 0) return <span className="text-gray-400">—</span>
        return (
            <ul className="list-disc pl-5">
                {v.map((x, i) => (
                    <li key={i}>
                        {typeof x === 'object'
                            ? <code className="text-xs bg-gray-50 px-1 py-0.5 rounded">{JSON.stringify(x)}</code>
                            : String(x)}
                    </li>
                ))}
            </ul>
        )
    }
    return <pre className="text-xs bg-gray-50 p-2 rounded border overflow-auto">{JSON.stringify(v, null, 2)}</pre>
}
