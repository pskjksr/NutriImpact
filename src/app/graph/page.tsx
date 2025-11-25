"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { HomeIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import LogoutButton from "@/components/LogoutButton";
import { motion } from "framer-motion";

type Student = {
  id: string;
  score: number;
  level: string;
  yearLevel: string;
};

type StatsData = {
  total: number;
  distribution: {
    Low: number;
    Moderate: number;
    High: number;
    Severe: number;
  };
  items: Student[];
};

export default function StressAnalysisPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterYear, setFilterYear] = useState<string>("All");
  const [filterLevel, setFilterLevel] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStudents = useMemo(() => {
    if (!data) return [];
    return data.items.filter((student) => {
      const matchYear = filterYear === "All" || student.yearLevel === filterYear;
      const matchLevel = filterLevel === "All" || student.level === filterLevel;
      return matchYear && matchLevel;
    });
  }, [data, filterYear, filterLevel]);

  const uniqueYears = useMemo(() => {
    if (!data) return [];
    const years = new Set(data.items.map((s) => s.yearLevel));
    return Array.from(years).sort();
  }, [data]);

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
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-blue-600 shadow-inner font-bold"
            >
              <ChartBarIcon className="w-6 h-6" /> วิเคราะห์ความเครียด
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3 px-5">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">📊 วิเคราะห์ความเครียด (ST5)</h1>

        {loading && <p className="text-gray-500">กำลังโหลดข้อมูล...</p>}
        {error && <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>}

        {data && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "เครียดน้อย (Low)", count: data.distribution.Low, color: "bg-green-500" },
                { label: "ปานกลาง (Moderate)", count: data.distribution.Moderate, color: "bg-yellow-500" },
                { label: "เครียดมาก (High)", count: data.distribution.High, color: "bg-orange-500" },
                { label: "รุนแรง (Severe)", count: data.distribution.Severe, color: "bg-red-500" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05 }}
                  className={`${item.color} text-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center`}
                >
                  <h3 className="text-lg font-semibold opacity-90">{item.label}</h3>
                  <p className="text-4xl font-bold mt-2">{item.count} คน</p>
                </motion.div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 ค้นหาแบบเฉพาะเจาะจง</h2>
              <div className="flex flex-wrap gap-4">
                {/* Year Filter */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">ชั้นปี</label>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">ทั้งหมด</option>
                    {uniqueYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stress Level Filter */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">ระดับความเครียด</label>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">ทั้งหมด</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
              </div>

              {/* Result Count */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 text-blue-800">
                <span className="font-bold text-lg">{filteredStudents.length}</span> คน ที่ตรงตามเงื่อนไข
              </div>
            </div>

            {/* Student List */}
            {filteredStudents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-600">ID / Session</th>
                      <th className="px-6 py-4 font-semibold text-gray-600">ชั้นปี</th>
                      <th className="px-6 py-4 font-semibold text-gray-600">คะแนน (Score)</th>
                      <th className="px-6 py-4 font-semibold text-gray-600">ระดับความเครียด</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-blue-50 transition">
                        <td className="px-6 py-4 text-gray-800 font-medium">{student.id.slice(0, 8)}...</td>
                        <td className="px-6 py-4 text-gray-600">{student.yearLevel}</td>
                        <td className="px-6 py-4 text-gray-800">{student.score}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${student.level === "Low"
                                ? "bg-green-100 text-green-700"
                                : student.level === "Moderate"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : student.level === "High"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                          >
                            {student.level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
