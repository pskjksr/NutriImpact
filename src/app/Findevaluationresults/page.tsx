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
  const totalUsers = 125; // จำนวนผู้ใช้งานทั้งหมด
  const activeUsers = 78; // จำนวนผู้ใช้งานที่กำลัง active
  const usersPerPage = 10;

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // สร้างข้อมูลผู้ใช้หลัง client render
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

  const totalPages = Math.ceil(allUsers.length / usersPerPage);
  const startIdx = (currentPage - 1) * usersPerPage;
  const currentUsers = allUsers.slice(startIdx, startIdx + usersPerPage);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col justify-between p-6 shadow-lg">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Nutritional
          </h1>
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
      <main className="flex-1 p-6 overflow-y-auto space-y-8">
        {/* Users Summary Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Total Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-blue-100 hover:shadow-xl transition w-full md:w-1/3"
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

          {/* Active Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-green-100 hover:shadow-xl transition w-full md:w-1/3"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                <UserIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-500 font-medium">ผู้ใช้งานตอนนี้</p>
                <p className="text-2xl font-bold text-green-600">
                  {activeUsers}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* User List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-blue-100"
        >
          <h2 className="text-blue-600 font-bold text-lg mb-4 flex items-center gap-2">
            👥 รายการผู้ใช้
          </h2>

          <div className="space-y-4">
            {currentUsers.map((user) => (
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
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
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 disabled:opacity-50"
            >
              กลับ
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 disabled:opacity-50"
            >
              ต่อไป
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
