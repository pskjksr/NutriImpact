"use client";

import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaSignInAlt } from "react-icons/fa";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function SignupForm() {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
    general?: string;
  }>({});

  // ความแข็งแรงรหัสผ่านแบบเบสิค
  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร";
    if (!/[A-Za-z]/.test(pwd) || !/[0-9]/.test(pwd))
      return "ต้องมีตัวอักษรและตัวเลขอย่างน้อยอย่างละ 1";
    return undefined;
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    if (!email.trim()) nextErrors.email = "กรุณากรอกอีเมล";
    const pwdErr = validatePassword(password);
    if (!password.trim()) nextErrors.password = "กรุณากรอกรหัสผ่าน";
    else if (pwdErr) nextErrors.password = pwdErr;
    if (!confirmPassword.trim()) nextErrors.confirm = "กรุณากรอกรหัสผ่านอีกครั้ง";
    else if (password !== confirmPassword) nextErrors.confirm = "รหัสผ่านไม่ตรงกัน";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      setErrors({});
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/Login`
          : undefined;

      // สมัครสมาชิก
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo, // ลิงก์ในอีเมลจะเด้งกลับมาหน้านี้
          // data: { plan: "free" } // (ถ้าจะเก็บ user_metadata)
        },
      });

      if (error) {
        // เคสซ้ำ/อื่นๆ
        // error.message อาจเป็น "User already registered"
        setErrors({ general: error.message || "สมัครสมาชิกไม่สำเร็จ" });
        return;
      }

      // ถ้าเปิด Confirm Email -> session จะเป็น null
      if (!data.session) {
        setEmailSent(true);
        return;
      }

      // ถ้าปิด Confirm Email -> ล็อกอินได้เลย
      router.replace("/Login");
    } catch (err: any) {
      setErrors({ general: err?.message ?? "เกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/Login`
          : undefined;

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) setErrors({ general: error.message });
      else alert("ส่งอีเมลยืนยันใหม่แล้ว เช็คกล่องจดหมายได้เลย");
    } catch (e: any) {
      setErrors({ general: e?.message ?? "ส่งอีเมลไม่สำเร็จ" });
    } finally {
      setLoading(false);
    }
  };



  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.15 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-100 px-4 py-10 flex justify-center items-center font-sans">
      <motion.form
        onSubmit={handleSignup}
        initial="hidden"
        animate="visible"
        className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl w-full max-w-md p-10 border border-gray-200 hover:shadow-2xl transition-all duration-500"
      >
        <motion.div variants={fadeInUp} custom={0} className="flex justify-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center">
            สร้างบัญชี
            <span className="block w-24 mx-auto mt-3 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></span>
          </h2>
        </motion.div>

        {/* Email */}
        <motion.div variants={fadeInUp} custom={1} className="mb-4">
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className={`w-full pr-12 px-5 py-4 rounded-2xl bg-white/90 border ${errors.email ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm placeholder:text-gray-500 transition-all duration-300 hover:shadow-md focus:shadow-xl h-12`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </motion.div>

        {/* Password */}
        <motion.div variants={fadeInUp} custom={2} className="relative mb-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className={`w-full pr-12 px-5 py-4 rounded-2xl bg-white/90 border ${errors.password ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm placeholder:text-gray-500 transition duration-300 hover:shadow-md focus:shadow-xl h-12`}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword((p) => !p);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition duration-300"
            >
              {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </motion.div>

        {/* Confirm Password */}
        <motion.div variants={fadeInUp} custom={3} className="relative mb-6">
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="ป้อนรหัสผ่านอีกครั้ง"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              className={`w-full pr-12 px-5 py-4 rounded-2xl bg-white/90 border ${errors.confirm ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm placeholder:text-gray-500 transition duration-300 hover:shadow-md focus:shadow-xl h-12`}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowConfirm((p) => !p);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition duration-300"
            >
              {showConfirm ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirm && <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>}
        </motion.div>

        {/* CTA */}
        <motion.button
          variants={fadeInUp}
          custom={4}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full py-4 mb-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-blue-400/60 transition duration-300 disabled:opacity-60"
        >
          {loading ? "กำลังสมัคร..." : "สร้างบัญชี"}
        </motion.button>

        {/* OAuth (ทางเลือก) */}


        {/* แจ้งเตือนทั่วไป */}
        {errors.general && (
          <p className="text-red-500 text-center text-sm mb-4">{errors.general}</p>
        )}

        {/* แจ้งส่งอีเมลยืนยัน + ปุ่ม resend */}
        {emailSent && (
          <div className="mb-4 rounded-xl border bg-green-50 text-blue-500 p-3">
            เราส่งลิงก์ยืนยันไปที่ <b>{email}</b> แล้ว เช็คอีเมลได้เลย
            <button
              type="button"
              onClick={handleResendEmail}
              className="ml-2 underline underline-offset-2 hover:opacity-80"
              disabled={loading}
            >
              ส่งอีกครั้ง
            </button>
          </div>
        )}

        <motion.p
          variants={fadeInUp}
          custom={5}
          className="text-center text-gray-700 text-sm mt-6 flex justify-center items-center gap-2"
        >
          <span className="text-gray-500">มีบัญชีแล้ว?</span>
          <Link
            href="/Login"
            className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg shadow-md font-medium text-sm transition-all duration-300 hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:scale-105"
          >
            <FaSignInAlt className="w-4 h-4" />
            เข้าสู่ระบบ
          </Link>
        </motion.p>
      </motion.form>
    </div>
  );
}
