"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { UserIcon, HomeIcon, ChartBarIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid"

type AdminUser = {
  userId: string
  name: string | null
  email: string | null
  picture: string | null
  sessionId: string | null
  startedAt: string | null
  finishedAt: string | null
  stress: number | null
  department: string | null
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const size = 10

  const [items, setItems] = useState<AdminUser[]>([])
  const [totalUsers, setTotalUsers] = useState(0)   // ทั้งระบบ
  const [count, setCount] = useState(0)             // จำนวนผลลัพธ์ตามตัวกรองปัจจุบัน

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
      ; (async () => {
        try {
          const res = await fetch(`/api/admin/users?q=${encodeURIComponent(search)}&page=${page}&size=${size}`, { cache: 'no-store' })
          const contentType = res.headers.get('content-type') || ''
          const raw = await res.text()
          if (!contentType.includes('application/json')) {
            throw new Error(`API ส่ง non-JSON (status ${res.status})\ncontent-type: ${contentType}\nbody: ${raw.slice(0, 180)}`)
          }
          const json = JSON.parse(raw)
          if (json.error) throw new Error(json.error)

          const mapped: AdminUser[] = (json.items ?? []).map((it: any) => ({
            userId: it.userId ?? it.sessionId ?? it.id,   // ใช้ session id เป็นตัวอ้างอิง
            name: it.name ?? it.formSlug ?? null,
            email: null,
            picture: null,
            sessionId: it.sessionId ?? it.userId ?? null,
            startedAt: it.startedAt ?? null,                 // ← เดิมใช้ lastStartedAt
            finishedAt: it.finishedAt ?? null,                // ← เดิมใช้ lastFinishedAt
            stress: typeof it.stress === 'number' ? it.stress : null,  // ← ผลรวม st5_q1..st5_q5
            department: it.department ?? null                 // ← เดิมเป็นข้อความสรุป v…/เสร็จ…
          }))

          if (cancelled) return
          setItems(mapped)
          setTotalUsers(json.meta?.totalForms ?? 0)
          setCount(json.meta?.count ?? mapped.length)
        } catch (e: any) {
          if (!cancelled) setError(String(e?.message || e))
        } finally {
          if (!cancelled) setLoading(false)
        }
      })()
    return () => { cancelled = true }
  }, [search, page])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(count / size)), [count])

  // ✅ CSV
  const handleDownloadCSV = async () => {
    try {
      const qs = new URLSearchParams()
      if (search) qs.set('q', search)

      const res = await fetch(`/api/admin/export_csv?${qs.toString()}`, { method: 'GET' })
      if (!res.ok) throw new Error('ดาวน์โหลดไม่สำเร็จ')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nutritional_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert('ดาวน์โหลดไฟล์ไม่สำเร็จ')
    }
  }

  // ✅ Excel
  const handleDownloadExcel = async () => {
    try {
      const qs = new URLSearchParams()
      if (search) qs.set('q', search)

      const res = await fetch(`/api/admin/export?${qs.toString()}`, { method: 'GET' })
      if (!res.ok) throw new Error('ดาวน์โหลดไม่สำเร็จ')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nutritional_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert('ดาวน์โหลดไฟล์ไม่สำเร็จ')
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col justify-between p-6 shadow-2xl rounded-r-3xl">
        <div className="space-y-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Nutritional</h1>
          <nav className="space-y-3">
            <Link href="/Findevaluationresults" className="flex items-center gap-3 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 transition-all duration-300 shadow-md">
              <HomeIcon className="w-6 h-6" /> หน้าเเรก
            </Link>
            <Link href="/graph" className="flex items-center gap-3 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 transition-all duration-300 shadow-md">
              <ChartBarIcon className="w-6 h-6" /> กราฟวิเคราะห์ข้อมูล
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/Login" className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-500 hover:bg-red-400 transition-all duration-300 shadow-md">
            <ArrowRightOnRectangleIcon className="w-6 h-6" /> ออกจากระบบ
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl p-6 border border-white/30 w-full md:w-1/3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <UserIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-500 font-medium">ผู้ใช้ทั้งหมดในระบบ</p>
                <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Header + search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <h2 className="text-blue-600 font-bold text-lg">
            👥 รายการผู้ใช้
            <span className="ml-2 text-sm text-gray-500">(แสดงผลตามตัวกรอง: {count} คน)</span>
          </h2>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="ค้นหาผู้ใช้..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-4 pr-10 py-2.5 rounded-2xl border border-white/30 bg-white/60 backdrop-blur-md shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-300"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading && <p className="text-gray-500">กำลังโหลดข้อมูล…</p>}
          {error && <p className="text-red-600">โหลดไม่สำเร็จ: {error}</p>}

          {!loading && !error && items.length === 0 && (
            <p className="text-gray-500 text-center py-6">ไม่พบผู้ใช้</p>
          )}

          {!loading && !error && items.map((u) => (
            <Link key={u.userId} href={`/admin/users/${u.userId}`} prefetch={false} className="block">
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-xl cursor-pointer"
                aria-label={`เปิดดูข้อมูลของ ${u.name ?? "ผู้ใช้"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center">
                    {u.picture
                      ? <img src={u.picture} alt={u.name ?? 'user'} className="w-full h-full object-cover" />
                      : <UserIcon className="w-6 h-6 text-blue-600" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{u.name ?? 'ไม่ระบุชื่อ'}</p>
                    <p className="text-sm text-gray-500">{u.department ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600 font-medium shadow-sm">
                    Stress: {u.stress ?? 0}
                  </span>
                  <p className="text-sm text-gray-500">
                    {u.startedAt ? new Date(u.startedAt).toLocaleDateString() : '-'}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Footer: ซ้าย = ดาวน์โหลด, ขวา = หน้า */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow"
            >
              ดาวน์โหลด CSV
            </button>
            <button
              onClick={handleDownloadExcel}
              className="px-4 py-2 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition shadow"
            >
              ดาวน์โหลด Excel
            </button>
          </div>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-2xl bg-blue-100 text-blue-600 disabled:opacity-50 hover:bg-blue-200 transition"
            >
              กลับ
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-2xl bg-blue-100 text-blue-600 disabled:opacity-50 hover:bg-blue-200 transition"
            >
              ต่อไป
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
