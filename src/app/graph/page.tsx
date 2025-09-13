"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HomeIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// 🔹 ข้อมูลต้นฉบับ
const rawData = [
  { subject: "หวาน", Daily: 12, Weekly: 13, Monthly: 14 },
  { subject: "ไขมัน", Daily: 9, Weekly: 11, Monthly: 12 },
  { subject: "โซเดียม", Daily: 11, Weekly: 12, Monthly: 13 },
  { subject: "ความเครียด (ST5)", Daily: 15, Weekly: 14, Monthly: 15 },
  { subject: "ทักษะความรู้", Daily: 10, Weekly: 9, Monthly: 11 },
];

// 🔹 กำหนดสีให้แต่ละ subject
const COLORS: Record<string, string> = {
  หวาน: "#ef4444", // แดง
  ไขมัน: "#f59e0b", // ส้ม
  โซเดียม: "#3b82f6", // น้ำเงิน
  "ความเครียด (ST5)": "#10b981", // เขียว
  ทักษะความรู้: "#8b5cf6", // ม่วง
};

export default function GraphPage() {
  // 🔹 รวมค่าทั้ง Daily + Weekly + Monthly
  const combinedData = useMemo(() => {
    return rawData.map((item) => ({
      name: item.subject,
      value: item.Daily + item.Weekly + item.Monthly,
    }));
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col justify-between p-6 shadow-2xl rounded-r-3xl">
        <div className="space-y-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Nutritional
          </h1>
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

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">
            🥧 กราฟวงกลมแสดงข้อมูลรวม
          </h1>
        </div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-[calc(100vh-96px)] bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 flex items-center justify-center" // ❌ เอา border ออก
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={combinedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label
                isAnimationActive={true}
                stroke="none" // ❌ ไม่ให้มีเส้นขอบดำ
              >
                {combinedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name] || "#8884d8"}
                    stroke="none" // ❌ ปิดเส้นขอบของแต่ละ slice
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </main>
    </div>
  );
}
