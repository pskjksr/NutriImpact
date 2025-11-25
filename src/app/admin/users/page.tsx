"use client"

import { JSX, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'


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

type ApiResp = {
    summary: Summary
    answers: Record<string, any>
}

function UserDetail() {
    const searchParams = useSearchParams()
    const userId = searchParams.get('user_id')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [summary, setSummary] = useState<Summary | null>(null)
    const [answers, setAnswers] = useState<Record<string, any>>({})

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError(null)

            ; (async () => {
                try {
                    const res = await fetch(`/api/admin/users/${encodeURIComponent(userId ?? "")}`, { cache: "no-store" })
                    const ct = res.headers.get("content-type") || ""
                    const raw = await res.text()
                    if (!ct.includes("application/json")) {
                        throw new Error(`API ส่ง non-JSON (status ${res.status})`)
                    }
                    const json: ApiResp | { error: string } = JSON.parse(raw)
                    if ((json as any).error) throw new Error((json as any).error)
                    if (cancelled) return
                    setSummary((json as ApiResp).summary ?? null)
                    setAnswers((json as ApiResp).answers ?? {})
                } catch (e: any) {
                    if (!cancelled) setError(String(e?.message || e))
                } finally {
                    if (!cancelled) setLoading(false)
                }
            })()

        return () => { cancelled = true }
    }, [userId])

    // รวมคะแนน ST-5 จาก answers (เผื่อ summary.stress ไม่มี)
    const stressTotal = useMemo(() => {
        const ks = ["st5_q1", "st5_q2", "st5_q3", "st5_q4", "st5_q5"]
        return ks.reduce((t, k) => {
            const n = parseInt(String((answers as any)?.[k] ?? 0), 10)
            return t + (Number.isFinite(n) ? n : 0)
        }, 0)
    }, [answers])

    // จัดกลุ่มคีย์ที่รู้จัก แล้วดันคีย์ที่เหลือไป “อื่น ๆ”
    const groups = useMemo(() => {
        const picked = new Set<string>()
        const pick = (keys: string[]) =>
            keys
                .filter(k => (answers as any)[k] !== undefined)
                .map(k => {
                    picked.add(k)
                    return [k, (answers as any)[k]] as const
                })

        const g = [
            { title: "ข้อมูลทั่วไป", rows: pick(["gender", "age", "year_level", "current_department", "height_cm", "weight_kg"]) },
            { title: "ประวัติการผ่าตัด", rows: pick(["surgery_history", "surgery_detail"]) },
            { title: "สถานะสุขภาพ", rows: pick(["k41_q1", "k41_q2", "k41_q3", "k41_q4", "k41_q5", "k41_q6", "k42", "k43"]) },
            { title: "แบบประเมินความเครียด (ST-5)", rows: pick(["st5_q1", "st5_q2", "st5_q3", "st5_q4", "st5_q5"]).concat([["st5_total", stressTotal] as const]) },
            { title: "พฤติกรรมการกิน 3.1", rows: pick(["diet31_q1", "diet31_q2", "diet31_q3", "diet31_q4", "diet31_q5"]) },
            { title: "พฤติกรรมการกิน 3.2", rows: pick(["diet32_q1", "diet32_q2", "diet32_q3", "diet32_q4", "diet32_q5"]) },
            { title: "พฤติกรรมการกิน 3.3", rows: pick(["diet33_q1", "diet33_q2", "diet33_q3", "diet33_q4", "diet33_q5"]) },
            { title: "คำนวณอัตโนมัติ", rows: Object.entries((answers as any)?._computed ?? {}).map(([k, v]) => [k, v] as const) },
        ]

        const otherRows: Array<readonly [string, any]> = []
        for (const [k, v] of Object.entries(answers ?? {})) {
            if (k === "_computed") continue
            if (!picked.has(k)) otherRows.push([k, v] as const)
        }
        if (otherRows.length) g.push({ title: "อื่น ๆ", rows: otherRows })

        return g.filter(sec => sec.rows.length > 0)
    }, [answers, stressTotal])

    const label = (k: string) => {
        const map: Record<string, string> = {
            gender: "เพศ", age: "อายุ", year_level: "ชั้นปี", current_department: "แผนก",
            height_cm: "ส่วนสูง (ซม.)", weight_kg: "น้ำหนัก (กก.)",
            surgery_history: "ประวัติการผ่าตัด", surgery_detail: "รายละเอียดการผ่าตัด",
            k42: "ดัชนีมวลกาย (แปลผล)", k43: "ความดันโลหิต (แปลผล)",

            // ST-5
            st5_q1: 'มีปัญหาการนอน นอนไม่หลับหรือนอนมาก',
            st5_q2: 'มีสมาธิลดลง',
            st5_q3: 'หงุดหงิด / กระวนกระวาย / ว้าวุ่นใจ',
            st5_q4: 'รู้สึกเบื่อ เซ็ง',
            st5_q5: 'ไม่อยากพบปะผู้คน',
            st5_total: "คะแนนเครียดรวม",

            // Diet 3.1
            diet31_q1: 'ดื่มน้ำเปล่า',
            diet31_q2: 'ดื่มน้ำอัดลม กาแฟ ชา น้ำหวาน นมเปรี้ยว',
            diet31_q3: 'ดื่มน้ำผักผลไม้สำเร็จรูป',
            diet31_q4: 'กินไอศกรีม เบเกอรี่ หรือขนมหวานไทย',
            diet31_q5: 'เติมน้ำตาลเพิ่มลงในอาหาร',

            // Diet 3.2
            diet32_q1: 'เลือกกินเนื้อสัตว์ไม่ติดมัน ไม่ติดหนัง',
            diet32_q2: 'กินอาหารทอด อาหารฟาสต์ฟู้ด อาหารผัดน้ำมัน',
            diet32_q3: 'กินอาหารจานเดียว ไขมันสูง หรืออาหารประเภทแกงกะทิ',
            diet32_q4: 'ดื่มเครื่องดื่มที่ผสมนมข้นหวาน ครีมเทียม วิปปิ้งครีม',
            diet32_q5: 'ซดน้ำผัก/น้ำแกง หรือ ราดน้ำผักน้ำแกงลงในข้าว',

            // Diet 3.3
            diet33_q1: 'ชิมอาหารก่อนปรุง น้ำปลา ซีอิ๊ว ซอส',
            diet33_q2: 'กินอาหารที่มีสมุนไพรหรือเครื่องเทศ เป็นส่วนประกอบ',
            diet33_q3: 'กินเนื้อสัตว์แปรรูป ไส้กรอก หมูยอ แฮม ปลาทูเค็ม กุ้งแห้ง ปลาร้า',
            diet33_q4: 'กินอาหารสำเร็จรูปหรืออาหารแช่แข็ง',
            diet33_q5: 'กินผักผลไม้ดองหรือผลไม้แช่อิ่ม',

            // K41
            k41_q1: 'ไม่ทานอาหารขยะ',
            k41_q2: 'อ่านฉลากอาหาร',
            k41_q3: 'ทานอาหารเสริม',
            k41_q4: 'ติดตามการกินของตนเองและปริมาณอาหารที่กิน',
            k41_q5: 'ชั่งน้ำหนักและติดตามเป็นประจำ',
            k41_q6: 'กินตลอดทั้งวัน',

            bmi: "BMI", bsa: "BSA", bmi_status: "BMI (แปลผล)", bsa_status: "BSA (แปลผล)",
        }
        return map[k] ?? k
    }

    const copyJson = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(answers ?? {}, null, 2))
            alert("คัดลอก JSON แล้ว")
        } catch {
            alert("คัดลอกไม่สำเร็จ")
        }
    }

    const downloadJson = () => {
        const blob = new Blob([JSON.stringify(answers ?? {}, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `answers_${summary?.sessionId ?? "session"}.json`
        document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <div className="mb-4">
                <Link href="/Findevaluationresults" className="text-blue-600 hover:underline">← กลับ</Link>
            </div>

            {loading && <p className="text-gray-500">กำลังโหลดข้อมูล…</p>}
            {error && <p className="text-red-600">โหลดไม่สำเร็จ: {error}</p>}

            {!loading && !error && summary && (
                <div className="space-y-6">
                    {/* สรุปบนหัว */}
                    <div className="bg-white rounded-2xl p-6 shadow">
                        <h2 className="text-xl font-bold mb-3">รายละเอียดแบบฟอร์ม</h2>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                            <div>แบบฟอร์ม: {summary.formSlug ?? "—"} (v{summary.version ?? "—"})</div>
                            <div>เริ่ม: {summary.startedAt ? new Date(summary.startedAt).toLocaleString() : "—"}</div>
                            <div>เสร็จ: {summary.finishedAt ? new Date(summary.finishedAt).toLocaleString() : "—"}</div>
                            <div>เพศ/ชั้นปี/แผนก: {summary.gender ?? "—"} / {summary.yearLevel ?? "—"} / {summary.department ?? "—"}</div>
                            <div>BMI/BSA: {summary.bmi ?? "—"} ({summary.bmiStatus ?? "—"}) / {summary.bsa ?? "—"} ({summary.bsaStatus ?? "—"})</div>
                            <div>คะแนนเครียดรวม: <b>{summary.stress ?? stressTotal}</b></div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button onClick={copyJson} className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">คัดลอก JSON</button>
                            <button onClick={downloadJson} className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">ดาวน์โหลด JSON</button>
                        </div>
                    </div>

                    {/* คำตอบทั้งหมด (จัดกลุ่ม) */}
                    {groups.map((sec) => (
                        <div key={sec.title} className="bg-white rounded-2xl p-6 shadow">
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
            )}
        </div>
    )
}

export default function UserDetailPage() {
    return (
        <Suspense>
            <UserDetail />
        </Suspense>
    )
}

// เรนเดอร์ค่าที่เป็น primitive/array/object ให้ดูง่าย (กัน undefined)
function renderValue(v: any): JSX.Element {
    if (v === null || v === undefined) return <span className="text-gray-400">—</span>
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
        return <span>{String(v)}</span>
    }
    if (Array.isArray(v)) {
        if (v.length === 0) return <span className="text-gray-400">—</span>
        return (
            <ul className="list-disc pl-5">
                {v.map((x, i) => (
                    <li key={i}>
                        {typeof x === "object"
                            ? <code className="text-xs bg-gray-50 px-1 py-0.5 rounded">{JSON.stringify(x)}</code>
                            : String(x)}
                    </li>
                ))}
            </ul>
        )
    }
    return (
        <pre className="text-xs bg-gray-50 p-2 rounded border overflow-auto">
            {JSON.stringify(v, null, 2)}
        </pre>
    )
}
