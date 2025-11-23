"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function NewPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);

        if (password.length < 8) return setErr("รหัสผ่านต้องอย่างน้อย 8 ตัว");
        if (password !== confirm) return setErr("รหัสผ่านไม่ตรงกัน");

        try {
            setLoading(true);
            const supabase = supabaseBrowser();

            // ต้องมี session แล้ว (หลัง verify OTP สำเร็จ)
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            // เคลียร์ session แล้วพากลับไปล็อกอิน
            await supabase.auth.signOut();
            router.replace("/Login?reset=success");
        } catch (e: any) {
            setErr(e?.message ?? "ตั้งรหัสผ่านไม่สำเร็จ กรุณาลองใหม่");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-indigo-100 flex items-center justify-center px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white/80 backdrop-blur rounded-3xl shadow-xl p-8"
            >
                <h1 className="text-3xl font-extrabold text-center mb-8">ตั้งรหัสผ่านใหม่</h1>

                {/* รหัสผ่านใหม่ */}
                <div className="relative mb-5">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="รหัสผ่านใหม่ (8 ตัว)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 rounded-2xl border border-gray-300 px-4 pr-12 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowPassword((prev) => !prev);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                        aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    >
                        {showPassword ? <EyeIcon className="w-6 h-6" /> : <EyeSlashIcon className="w-6 h-6" />}
                    </button>
                </div>

                {/* ยืนยันรหัสผ่านใหม่ */}
                <div className="relative mb-2">
                    <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="ยืนยันรหัสผ่านใหม่"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="w-full h-12 rounded-2xl border border-gray-300 px-4 pr-12 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowConfirm((prev) => !prev);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                        aria-label={showConfirm ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    >
                        {showConfirm ? <EyeIcon className="w-6 h-6" /> : <EyeSlashIcon className="w-6 h-6" />}
                    </button>
                </div>

                {err && <p className="text-red-600 text-sm mt-2">{err}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:opacity-90 disabled:opacity-60"
                >
                    {loading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
                </button>
            </form>
        </div>
    );
}
