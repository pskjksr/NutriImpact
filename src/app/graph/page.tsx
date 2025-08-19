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
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// ข้อมูลกราฟ
const dataDaily = [
  { name: "Mon", consumption: 8, nutrition: 6, stress: 12 },
  { name: "Tue", consumption: 12, nutrition: 9, stress: 15 },
  { name: "Wed", consumption: 10, nutrition: 7, stress: 10 },
  { name: "Thu", consumption: 14, nutrition: 10, stress: 18 },
  { name: "Fri", consumption: 11, nutrition: 8, stress: 14 },
  { name: "Sat", consumption: 9, nutrition: 7, stress: 13 },
  { name: "Sun", consumption: 7, nutrition: 6, stress: 11 },
];

const dataWeekly = [
  { name: "Week 1", consumption: 50, nutrition: 40, stress: 60 },
  { name: "Week 2", consumption: 45, nutrition: 38, stress: 55 },
  { name: "Week 3", consumption: 48, nutrition: 42, stress: 58 },
  { name: "Week 4", consumption: 52, nutrition: 44, stress: 62 },
];

const dataMonthly = [
  { name: "Jan", consumption: 200, nutrition: 180, stress: 220 },
  { name: "Feb", consumption: 190, nutrition: 170, stress: 210 },
  { name: "Mar", consumption: 210, nutrition: 190, stress: 230 },
];

export default function GraphPage() {
  const [range, setRange] = useState<"Daily" | "Weekly" | "Monthly">("Daily");

  const getData = () => {
    if (range === "Daily") return dataDaily;
    if (range === "Weekly") return dataWeekly;
    return dataMonthly;
  };

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
          <h1 className="text-2xl font-bold text-blue-600">📊 กราฟวิเคราะห์ข้อมูล</h1>
          <div className="flex gap-2">
            {["Daily", "Weekly", "Monthly"].map((item) => (
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-[calc(100vh-96px)] bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-blue-100"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getData()}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="consumption"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                name="พฤติกรรมการบริโภค"
              />
              <Bar
                dataKey="nutrition"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                name="โภชนาการ"
              />
              <Bar
                dataKey="stress"
                fill="#f97316"
                radius={[6, 6, 0, 0]}
                name="ความเครียด (ST5)"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </main>
    </div>
  );
}
