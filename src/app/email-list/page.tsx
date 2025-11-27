"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HomeIcon, ChartBarIcon, UsersIcon } from "@heroicons/react/24/solid";
import LogoutButton from "@/components/LogoutButton";

type Participant = {
    id: string;
    email: string;
    submitted_at: string;
};

export default function EmailListPage() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/admin/participants");
                if (!res.ok) throw new Error("Failed to fetch data");
                const json = await res.json();
                setParticipants(json.participants || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                            <ChartBarIcon className="w-6 h-6" /> วิเคราะห์ความเครียด
                        </Link>
                        <Link
                            href="/email-list"
                            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-blue-600 shadow-inner font-bold"
                        >
                            <UsersIcon className="w-6 h-6" /> รายชื่อ Email
                        </Link>
                    </nav>
                </div>

                <div className="flex flex-col gap-3 px-5">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold text-blue-800 mb-6">📧 รายชื่อ Email ทั้งหมด</h1>

                {loading && <p className="text-gray-500">กำลังโหลดข้อมูล...</p>}
                {error && <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>}

                {!loading && !error && (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600">ID</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">วันที่ส่งข้อมูล</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {participants.map((p) => (
                                    <tr key={p.id} className="hover:bg-blue-50 transition">
                                        <td className="px-6 py-4 text-gray-600">{p.id.slice(0, 8)}...</td>
                                        <td className="px-6 py-4 text-gray-800 font-medium">{p.email}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(p.submitted_at).toLocaleDateString("th-TH")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-4 text-gray-500 text-sm text-right">
                            ทั้งหมด {participants.length} รายการ
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
