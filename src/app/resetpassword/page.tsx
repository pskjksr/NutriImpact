"use client";

import { useState, FormEvent, ChangeEvent, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s.trim());
const normPhone = (s: string) => s.replace(/\s+/g, "");
const isPhone = (s: string) => /^\+?\d{8,15}$/.test(normPhone(s));

export default function ForgotPasswordPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => supabaseBrowser(), []);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = input.trim();
    if (!target) return alert("กรอกอีเมลหรือเบอร์โทรก่อนน้า");

    try {
      setLoading(true);

      // 1) ส่ง OTP
      if (isEmail(target)) {
        const { error } = await supabase.auth.signInWithOtp({
          email: target,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: `${window.location.origin}/OTP`, // เผื่อกด Magic Link
          },
        });
        if (error) throw error;

        // 2) เก็บ context ไว้ใช้หน้า OTP
        sessionStorage.setItem("otp_target", target);
        sessionStorage.setItem("otp_channel", "email");
      } else if (isPhone(target)) {
        const phone = normPhone(target);
        const { error } = await supabase.auth.signInWithOtp({
          phone,
          options: { channel: "sms", shouldCreateUser: false } as any,
        });
        if (error) throw error;

        sessionStorage.setItem("otp_target", phone);
        sessionStorage.setItem("otp_channel", "sms");
      } else {
        alert("รูปแบบไม่ถูก ต้องเป็นอีเมล");
        return;
      }

      router.push("/OTP");
    } catch (err: any) {
      alert(err?.message ?? "ส่ง OTP ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.15 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-indigo-100 flex items-center justify-center px-6 py-10 font-sans">
      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl w-full max-w-md p-10 border border-gray-200 hover:shadow-2xl transition-all duration-500"
      >ลืม0f0e
        <motion.div variants={fadeInUp} custom={0} className="flex justify-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center">
            ลืมรหัสผ่าน
            <span className="block w-24 mx-auto mt-3 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></span>
          </h2>
        </motion.div>

        <motion.p variants={fadeInUp} custom={1} className="text-center text-gray-600 mb-10 text-sm md:text-base leading-relaxed">
          กรอกอีเมล เพื่อรับรหัส OTP สำหรับตั้งรหัสผ่านใหม่
        </motion.p>

        <motion.div variants={fadeInUp} custom={2} className="mb-6">
          <input
            type="text"
            placeholder="อีเมล"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white/90 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm placeholder:text-gray-500 transition duration-300 hover:shadow-md focus:shadow-xl"
          />
        </motion.div>

        <motion.button
          variants={fadeInUp}
          custom={3}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full py-4 mb-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-400/60 transition-all duration-300 disabled:opacity-60"
        >
          {loading ? "กำลังส่ง OTP..." : "รับรหัส OTP"}
        </motion.button>
      </motion.form>
    </div>
  );
}
