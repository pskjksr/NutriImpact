"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HomeIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";

// 🔹 จัดข้อมูลใหม่ให้อยู่ object เดียวต่อ subject
const data = [
  { subject: "หวาน", Daily: 12, Weekly: 13, Monthly: 14 },
  { subject: "ไขมัน", Daily: 9, Weekly: 11, Monthly: 12 },
  { subject: "โซเดียม", Daily: 11, Weekly: 12, Monthly: 13 },
  { subject: "ความเครียด (ST5)", Daily: 15, Weekly: 14, Monthly: 15 },
  { subject: "ทักษะความรู้", Daily: 10, Weekly: 9, Monthly: 11 },
];

// 🔹 กำหนดสีให้แต่ละช่วงเวลา
const COLORS: Record<string, string> = {
  Daily: "#ef4444",   // แดง
  Weekly: "#3b82f6",  // น้ำเงิน
  Monthly: "#10b981", // เขียว
};

export default function GraphPage() {
  const [range, setRange] = useState<"Daily" | "Weekly" | "Monthly" | "All">(
    "Daily"
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col justify-between p-6 shadow-lg">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Nutritional</h1>
          <nav className="space-y-3">
            <Link
              href="/Findevaluationresults"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
            >
              <HomeIcon className="w-5 h-5" /> หน้าเเรก
            </Link>
            <Link
              href="/graph"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
            >
              <ChartBarIcon className="w-5 h-5" /> กราฟวิเคราะห์ข้อมูล
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/Login"
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" /> ออกจากระบบ
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">
            📊 กราฟวิเคราะห์ข้อมูล
          </h1>
          <div className="flex gap-2">
            {["Daily", "Weekly", "Monthly", "All"].map((item) => (
              <motion.button
                key={item}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRange(item as any)}
                className={`px-3 py-1.5 rounded-lg text-sm transition shadow-sm ${
                  range === item
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                }`}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-[calc(100vh-96px)] bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-blue-100 flex items-center justify-center"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 15]} />
              <Tooltip />
              <Legend />

              {/* ถ้าเลือก All → แสดงทุกช่วงเวลา */}
              {range === "All"
                ? Object.keys(COLORS).map((key) => (
                    <Radar
                      key={key}
                      name={key}
                      dataKey={key}
                      stroke={COLORS[key]}
                      fill={COLORS[key]}
                      fillOpacity={0.3}
                    />
                  ))
                : // ถ้าเลือกช่วงเวลาเดียว → แสดงเฉพาะช่วงนั้น
                  range && (
                    <Radar
                      name={range}
                      dataKey={range}
                      stroke={COLORS[range]}
                      fill={COLORS[range]}
                      fillOpacity={0.4}
                    />
                  )}
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </main>
    </div>
  );
}
