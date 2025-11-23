"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from '@/lib/supabase/browser'


export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    const savedRemember = localStorage.getItem("savedRemember");

    if (savedEmail && savedPassword && savedRemember === "true") {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, []);

  const supabase = supabaseBrowser()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors: typeof errors = {}
    if (!email.trim() || !email.includes('@')) newErrors.email = 'กรุณากรอกอีเมลให้ถูกต้อง'
    if (!password.trim()) newErrors.password = 'กรุณากรอกรหัสผ่าน'
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      // จำฉันไว้: เก็บแค่ email ก็พอ (ไม่เก็บ password)
      if (remember) localStorage.setItem('savedEmail', email)
      else localStorage.removeItem('savedEmail')

      // เข้าสู่ระบบสำเร็จ → ไปหน้าหลักของแอดมิน
      router.push('/Findevaluationresults')
    } catch (err: any) {
      setErrors({ password: err?.message ?? 'เข้าสู่ระบบไม่สำเร็จ' })
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 px-4">
      <div className="w-full max-w-md mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold text-gray-900">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              ยินดีต้อนรับ
            </span>
          </h1>
          <p className="mt-4 text-gray-700 text-base leading-relaxed max-w-md mx-auto">
            ศึกษาความเครียดจากการเรียนที่ส่งผลต่อการรับประทานอาหาร และสุขภาวะทางกายและทางจิตใจ
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.form
          onSubmit={handleLogin}
          initial="hidden"
          animate="visible"
          className="bg-white/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 w-full p-8 hover:shadow-blue-300/40 transition-all duration-300"
        >
          <motion.div variants={fadeInUp} custom={0} className="mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              เข้าสู่ระบบ
            </h2>
            <span className="block w-20 h-1 mx-auto mt-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></span>
          </motion.div>

          {/* Email */}
          <motion.div variants={fadeInUp} custom={1} className="mb-5">
            <input
              type="text"
              placeholder="อีเมลหรือโทรศัพท์"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className={`w-full px-5 py-4 rounded-2xl bg-white/90 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md placeholder:text-gray-400 transition h-12`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </motion.div>

          {/* Password */}
          <motion.div variants={fadeInUp} custom={2} className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className={`w-full px-5 py-4 pr-12 rounded-2xl bg-white/90 border ${
                errors.password ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md placeholder:text-gray-400 transition h-12`}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword((prev) => !prev);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
            >
              {showPassword ? <EyeIcon className="w-6 h-6" /> : <EyeSlashIcon className="w-6 h-6" />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1 absolute">{errors.password}</p>}
          </motion.div>

          {/* Remember & Forgot */}
          <motion.div variants={fadeInUp} custom={3} className="flex items-center justify-between mb-7 text-sm">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const isChecked = e.target.checked;
                  setRemember(isChecked);
                  if (!isChecked) {
                    localStorage.removeItem("savedEmail");
                    localStorage.removeItem("savedPassword");
                    localStorage.removeItem("savedRemember");
                  }
                }}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-400"
              />
              <span className="text-gray-700 font-medium">จดจำการเข้าสู่ระบบ</span>
            </label>

            <Link href="/resetpassword" className="text-blue-600 font-medium hover:underline">
              ลืมรหัสผ่าน ?
            </Link>
          </motion.div>

          {/* Buttons */}
          <motion.button
            variants={fadeInUp}
            custom={4}
            whileHover={{ scale: 1.04, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-4 mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg transition"
          >
            เข้าสู่ระบบ
          </motion.button>

          <Link href="/SingUp">
            <motion.button
              variants={fadeInUp}
              custom={5}
              whileHover={{ scale: 1.04, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)" }}
              whileTap={{ scale: 0.97 }}
              type="button"
              className="w-full py-4 bg-gradient-to-r from-emerald-400 to-green-500 text-white font-semibold rounded-2xl shadow-lg transition"
            >
              ลงทะเบียน
            </motion.button>
          </Link>
        </motion.form>
      </div>
    </div>
  );
}
