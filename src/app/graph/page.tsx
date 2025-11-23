"use client";

import Link from "next/link";
import { HomeIcon, ChartBarIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

export default function GraphIndexPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col justify-between p-6 shadow-2xl rounded-r-3xl">
        <div className="space-y-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Nutritional</h1>
          <nav className="space-y-3">
            <Link
              href="/Findevaluationresults"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 transition-all duration-300 shadow-md"
            >
              <HomeIcon className="w-6 h-6" /> หน้าเเรก
            </Link>
            <Link
              href="/graph"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 transition-all duration-300 shadow-md"
            >
              <ChartBarIcon className="w-6 h-6" /> กราฟวิเคราะห์ข้อมูล
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/Login"
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-500 hover:bg-red-400 transition-all duration-300 shadow-md"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" /> ออกจากระบบ
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">📊 เลือกหัวข้อที่ต้องการดูกราฟ</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/graph/sugar" className="rounded-3xl h-56 flex items-center justify-center font-extrabold text-white text-4xl shadow-lg hover:scale-[1.01] transition"
                style={{ backgroundColor: "#ef4444" }}>
            หวาน
          </Link>

          <Link href="/graph/fat" className="rounded-3xl h-56 flex items-center justify-center font-extrabold text-white text-4xl shadow-lg hover:scale-[1.01] transition"
                style={{ backgroundColor: "#f59e0b" }}>
            ไขมัน
          </Link>

          <Link href="/graph/sodium" className="rounded-3xl h-56 flex items-center justify-center font-extrabold text-white text-4xl shadow-lg hover:scale-[1.01] transition"
                style={{ backgroundColor: "#3b82f6" }}>
            โซเดียม
          </Link>

          <Link href="/graph/stress" className="rounded-3xl h-56 flex items-center justify-center font-extrabold text-white text-4xl shadow-lg hover:scale-[1.01] transition"
                style={{ backgroundColor: "#10b981" }}>
            ความเครียด (ST5)
          </Link>
        </div>
      </main>
    </div>
  );
}
