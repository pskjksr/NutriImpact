"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", stress: 12 },
  { name: "Tue", stress: 15 },
  { name: "Wed", stress: 10 },
  { name: "Thu", stress: 18 },
  { name: "Fri", stress: 14 },
];

export default function DashboardPage() {
  const [range, setRange] = useState("Daily");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navbar */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold tracking-wide">📊 Dashboard</h1>

        {/* User Dropdown */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setOpen(!open)}
            className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center text-blue-600 font-bold shadow-md hover:shadow-lg transition"
          >
            👤
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden z-50 border border-blue-100"
              >
                <Link href="/Login" className="w-full">
                  <div className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer">
                    🚪 ออกจากระบบ
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-8">
        {/* Graph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-blue-100 hover:shadow-xl transition"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-blue-600 font-bold text-lg flex items-center gap-2">
              📈 Stress Graph
            </h2>
            <div className="flex gap-2">
              {["Daily", "Weekly", "Monthly"].map((item) => (
                <motion.button
                  key={item}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRange(item)}
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
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line
                  type="monotone"
                  dataKey="stress"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#2563eb" }}
                />
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* User List Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-blue-100"
        >
          <h2 className="text-blue-600 font-bold text-lg mb-4 flex items-center gap-2">
            👥 User List
          </h2>

          <div className="space-y-4">
            {Array(5)
              .fill(null)
              .map((_, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md"
                >
                  {/* Left side - User Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        User {idx + 1}
                      </p>
                      <p className="text-sm text-gray-500">
                        Medical Department
                      </p>
                    </div>
                  </div>

                  {/* Right side - Status */}
                  <div className="flex items-center gap-6">
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600 font-medium shadow-sm">
                      Stress: 15
                    </span>
                    <p className="text-sm text-gray-500">19/08/2025</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
