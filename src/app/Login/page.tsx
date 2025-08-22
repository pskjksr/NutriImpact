"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const router = useRouter();

  // โหลดข้อมูลจาก localStorage ถ้ามี
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

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email.trim()) newErrors.email = "กรุณากรอกอีเมลหรือเบอร์โทรศัพท์";
    if (!password.trim()) newErrors.password = "กรุณากรอกรหัสผ่าน";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // ตัวอย่างตรวจสอบรหัสผ่าน (สามารถเปลี่ยนเป็น API จริงได้)
      if (email === "admin@example.com" && password === "123456") {
        console.log("เข้าสู่ระบบสำเร็จ");

        if (remember) {
          localStorage.setItem("savedEmail", email);
          localStorage.setItem("savedPassword", password);
          localStorage.setItem("savedRemember", "true");
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
          localStorage.removeItem("savedRemember");
        }

        router.push("/Findevaluationresults"); // เปลี่ยนหน้าเรียบร้อย
      } else {
        setErrors({ password: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
      }
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-200">
      {/* Left side */}
      <div className="w-full md:w-1/2 hidden md:flex justify-center items-center p-12 bg-gradient-to-br from-blue-700 to-indigo-800">
        <div className="max-w-md text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-extrabold mb-6 drop-shadow-lg"
          >
            <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              ยินดีต้อนรับ
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="text-lg leading-relaxed opacity-90"
          >
            ศึกษาความเครียดจากการเรียนที่อาจส่งผลต่อการรับประทานอาหารในแต่ละวันและศึกษาผลจากการรับประทานอาหารต่างๆที่ส่งผลต่อ
            สุขภาวะทางกายและทางจิตใจ
          </motion.p>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 md:py-0">
        <motion.form
          onSubmit={handleLogin}
          initial="hidden"
          animate="visible"
          className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-md p-10 border border-white/50 hover:shadow-blue-300/50 transition-all duration-500"
        >
          <motion.div
            variants={fadeInUp}
            custom={0}
            className="flex justify-center mb-8"
          >
            <h2 className="text-4xl font-extrabold text-gray-800 text-center">
              เข้าสู่ระบบ
              <span className="block w-20 mx-auto mt-2 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></span>
            </h2>
          </motion.div>

          {/* Email */}
          <motion.div variants={fadeInUp} custom={1} className="mb-4">
            <input
              type="text"
              placeholder="อีเมลหรือโทรศัพท์"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className={`w-full pr-12 px-5 py-4 rounded-2xl bg-white/90 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm placeholder:text-gray-500 transition-all duration-300 hover:shadow-md focus:shadow-xl h-12`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div variants={fadeInUp} custom={2} className="relative mb-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className={`w-full pr-12 px-5 py-4 rounded-2xl bg-white/90 border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm placeholder:text-gray-500 transition duration-300 hover:shadow-md focus:shadow-xl h-12`}
              />

              {/* ปุ่มตาอยู่กึ่งกลางแน่นอน */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword((prev) => !prev);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition duration-300"
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* error message แยกออกมา ไม่ดัน input */}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 absolute">
                {errors.password}
              </p>
            )}
          </motion.div>

          {/* Remember & Forgot */}
          <motion.div
            variants={fadeInUp}
            custom={3}
            className="flex items-center justify-between mb-8 text-sm"
          >
            <label className="flex items-center gap-3 bg-blue-50 px-3 py-2 rounded-xl cursor-pointer hover:bg-blue-100 transition select-none">
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
                className="w-5 h-5 rounded-md text-blue-600 focus:ring-2 focus:ring-blue-400 transition"
              />
              <span className="text-gray-700 font-medium">
                จดจำการเข้าสู่ระบบ
              </span>
            </label>

            <a
              href="/resetpassword"
              className="text-blue-600 font-medium text-sm hover:underline"
            >
              ลืมรหัสผ่าน ?
            </a>
          </motion.div>

          {/* Buttons */}
          <motion.button
            variants={fadeInUp}
            custom={4}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-4 mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-blue-400/60 transition duration-300"
          >
            เข้าสู่ระบบ
          </motion.button>

          <Link href="/SingUp">
            <motion.button
              variants={fadeInUp}
              custom={5}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              className="w-full py-4 bg-gradient-to-r from-emerald-400 to-green-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-green-400/60 transition duration-300"
            >
              ลงทะเบียน
            </motion.button>
          </Link>
        </motion.form>
      </div>
    </div>
  );
}
