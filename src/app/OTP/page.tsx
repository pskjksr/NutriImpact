"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function OtpPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [counter, setCounter] = useState(0);
  const [target, setTarget] = useState<string>("");
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);

  // load target/channel from previous step
  useEffect(() => {
    const t = sessionStorage.getItem("otp_target") || "";
    const ch = (sessionStorage.getItem("otp_channel") as "email" | "sms") || "email";
    setTarget(t);
    setChannel(ch);
    if (!t) router.replace("/newpassword");
  }, [router]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const next = [...otp];
      next[index] = value;
      setOtp(next);
      if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const verify = async () => {
    const code = otp.join("");
    if (code.length < 6) return alert("กรุณากรอก OTP ให้ครบ 6 หลัก");
    try {
      setLoading(true);
      if (channel === "email") {
        const { error } = await supabase.auth.verifyOtp({
          email: target,
          token: code,
          type: "email",
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.verifyOtp({
          phone: target,
          token: code,
          type: "sms",
        });
        if (error) throw error;
      }

      // verified => มี session พร้อม เปลี่ยนรหัสผ่านได้
      router.replace("/newpassword");
    } catch (e: any) {
      alert(e?.message ?? "ยืนยันรหัสล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (counter > 0) return;
    try {
      setCounter(30);
      if (channel === "email") {
        const { error } = await supabase.auth.signInWithOtp({
          email: target,
          options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/otp` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          phone: target,
          options: { channel: "sms", shouldCreateUser: false } as any,
        });
        if (error) throw error;
      }
    } catch (e: any) {
      alert(e?.message ?? "ส่ง OTP ใหม่ไม่สำเร็จ");
      setCounter(0);
    }
  };

  useEffect(() => {
    if (counter <= 0) return;
    const t = setTimeout(() => setCounter((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [counter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-6 py-10 font-sans">
      <motion.form
        onSubmit={(e) => { e.preventDefault(); verify(); }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl w-full max-w-md p-10 border border-gray-200 hover:shadow-2xl transition-all duration-500"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          กรอกรหัส OTP
          <span className="block w-24 mx-auto mt-3 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></span>
        </h2>
        <p className="text-center text-gray-600 mb-8">
          เราส่งรหัสไปที่ <span className="font-medium">{target}</span>
        </p>

        <div className="flex justify-between mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-12 rounded-xl border border-gray-300 text-center text-xl font-bold shadow-sm bg-white/90 focus:ring-2 focus:ring-blue-400 focus:shadow-xl transition-all"
            />
          ))}
        </div>

        <div className="flex justify-between items-center text-sm mb-6 px-2">
          <span className="text-gray-500">ไม่ได้รับรหัส?</span>
          <button
            type="button"
            onClick={resend}
            disabled={counter > 0 || !target}
            className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
              counter > 0
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
            }`}
          >
            {counter > 0 ? `ส่งใหม่ได้ใน ${counter}s` : "ส่งรหัสอีกครั้ง"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-400/60 transition-all duration-300 disabled:opacity-60"
        >
          {loading ? "กำลังตรวจสอบ..." : "ยืนยัน OTP"}
        </button>
      </motion.form>
    </div>
  );
}
