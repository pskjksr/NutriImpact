"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserIcon,
  HomeIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

export default function DashboardPage() {
  const totalUsers = 125;
  const activeUsers = 78;
  const usersPerPage = 10;

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const users = Array.from({ length: totalUsers }, (_, idx) => ({
      id: idx + 1,
      name: `User ${idx + 1}`,
      department: "Medical Department",
      stress: Math.floor(Math.random() * 20) + 5,
      lastActive: "19/08/2025",
    }));
    setAllUsers(users);
  }, []);

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIdx = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIdx, startIdx + usersPerPage);

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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Summary Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl p-6 border border-white/30 hover:shadow-3xl transition w-full md:w-1/3"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <UserIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-500 font-medium">ผู้ใช้ทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl p-6 border border-white/30 hover:shadow-3xl transition w-full md:w-1/3"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                <UserIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-500 font-medium">ผู้ใช้งานตอนนี้</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* User List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl p-6 border border-white/30"
        >
          {/* Header: Title + Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <h2 className="text-blue-600 font-bold text-lg flex items-center gap-2">
              👥 รายการผู้ใช้
            </h2>

            <div className="relative w-full md:w-64">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>

              <input
                type="text"
                placeholder="ค้นหาผู้ใช้..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-10 py-2.5 rounded-2xl border border-white/30 bg-white/60 backdrop-blur-md 
                shadow-[0_4px_12px_rgba(0,0,0,0.08)] focus:shadow-[0_6px_18px_rgba(0,0,0,0.12)]
                focus:ring-2 focus:ring-blue-400 focus:border-blue-300
                transition-all duration-300 ease-in-out text-gray-800 placeholder-gray-400"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* User Items */}
          <div className="space-y-4">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600 font-medium shadow-sm">
                      Stress: {user.stress}
                    </span>
                    <p className="text-sm text-gray-500">{user.lastActive}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">ไม่พบผู้ใช้ที่ค้นหา</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 rounded-2xl bg-blue-100 text-blue-600 disabled:opacity-50 hover:bg-blue-200 transition"
            >
              กลับ
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 rounded-2xl bg-blue-100 text-blue-600 disabled:opacity-50 hover:bg-blue-200 transition"
            >
              ต่อไป
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
