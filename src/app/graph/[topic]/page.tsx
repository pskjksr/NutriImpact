"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    HomeIcon,
    ChartBarIcon,
    ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

type Row = { month: string; avg: number };

// สำหรับแสดงชื่อบน UI
const TOPIC_DISPLAY: Record<string, string> = {
    sugar: "หวาน",
    sweet: "หวาน",
    fat: "ไขมัน",
    sodium: "โซเดียม",
    stress: "ความเครียด (ST5)",
};

// slug -> คีย์ที่ API ต้องการ
const TOPIC_QUERY: Record<string, string> = {
    sugar: "sweet",
    fat: "fat",
    sodium: "sodium",
    stress: "stress",
};

// สีแท่งกราฟต่อหัวข้อ
const TOPIC_COLOR: Record<string, string> = {
    sugar: "#ef4444",   // แดง
    fat: "#f59e0b",     // ส้ม
    sodium: "#3b82f6",  // น้ำเงิน
    stress: "#10b981",  // เขียว
};

export default function TopicGraphPage() {
    // ใช้ useParams เพื่อให้แน่ใจว่าได้ slug เสมอใน client component
    const params = useParams<{ topic: string }>();
    const slug = String(params?.topic ?? "").toLowerCase();

    const apiTopic = TOPIC_QUERY[slug];
    const title = TOPIC_DISPLAY[slug] ?? "ไม่พบหัวข้อ";
    const color = TOPIC_COLOR[slug] ?? "#64748b";

    const [data, setData] = useState<Row[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        if (!apiTopic) {
            setErr("หัวข้อไม่ถูกต้อง");
            setLoading(false);
            return;
        }
        let cancelled = false;
        setLoading(true);

        // ปรับ endpoint ให้ตรงกับของคุณ
        fetch(`/api/admin/monthly?topic=${encodeURIComponent(apiTopic)}`)
            .then((r) => r.json())
            .then((res) => {
                if (cancelled) return;
                if (res.error) throw new Error(res.error);
                setData(res.items as Row[]);
            })
            .catch((e) => setErr(e.message))
            .finally(() => !cancelled && setLoading(false));

        return () => {
            cancelled = true;
        };
    }, [apiTopic]);

    const total = useMemo(
        () => (data ?? []).reduce((s, x) => s + (x?.avg ?? 0), 0),
        [data]
    );

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
            <main className="flex-1 p-6 overflow-auto space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-blue-600">
                        กราฟแท่ง: {title}
                    </h1>
                    {data && (
                        <span className="text-sm text-gray-500">
                            รวมเฉลี่ยทั้งหมด: {total.toFixed(1)}
                        </span>
                    )}
                </div>

                <Link href="/graph" className="text-blue-600 hover:underline">
                    ← กลับไปเลือกหัวข้อ
                </Link>

                <div className="w-full h-[calc(100vh-200px)] bg-white/90 rounded-2xl shadow p-4">
                    {loading && <p className="text-gray-500">กำลังโหลดข้อมูล...</p>}
                    {err && <p className="text-red-600">โหลดไม่สำเร็จ: {err}</p>}
                    {!loading && !err && data && data.length === 0 && (
                        <p className="text-gray-500">ยังไม่มีข้อมูลสำหรับหัวข้อนี้</p>
                    )}

                    {!loading && !err && data && data.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis domain={[0, "dataMax + 5"]} />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="avg"
                                    name={`ค่าเฉลี่ย (${title})`}
                                    fill={color}
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </main>
        </div>
    );
}
