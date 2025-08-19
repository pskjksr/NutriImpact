"use client";

import { useState, FormEvent } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (password !== confirm) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }
    console.log("✅ New password:", password);
    router.push("/success");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-6 py-10 font-sans">
      <div className="grid md:grid-cols-2 bg-white/50 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl border border-white/40">
        
        {/* Left image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex items-center justify-center p-8 bg-gradient-to-br"
        >
          <img
            src="/Human.png"
            alt="reset password"
            className="rounded-2xl shadow-xl w-4/5 h-auto object-contain hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* Right side form */}
        <div className="flex items-center justify-center w-full px-6 py-12 md:py-0">
          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: {} }} // ✅ ต้องมี ไม่งั้น error
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl w-full max-w-md p-10 border border-gray-200 hover:shadow-2xl transition-all duration-500"
          >
            {/* Title */}
            <motion.div
              variants={fadeInUp}
              custom={0}
              initial="hidden"
              animate="visible"
              className="flex justify-center mb-8"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                กรอกรหัสผ่านใหม่
                <span className="block w-24 mx-auto mt-3 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></span>
              </h2>
            </motion.div>

            {/* Password */}
            <motion.div
              variants={fadeInUp}
              custom={1}
              initial="hidden"
              animate="visible"
              className="relative mb-6"
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="ป้อนรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md placeholder:text-gray-500 pr-12 transition-all duration-300 hover:shadow-lg focus:shadow-xl"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword((prev) => !prev);
                }}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition duration-200"
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              variants={fadeInUp}
              custom={2}
              initial="hidden"
              animate="visible"
              className="relative mb-6"
            >
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="ป้อนรหัสผ่านอีกครั้ง"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md placeholder:text-gray-500 pr-12 transition-all duration-300 hover:shadow-lg focus:shadow-xl"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowConfirm((prev) => !prev);
                }}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition duration-200"
              >
                {showConfirm ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
            </motion.div>

            {/* Submit */}
            <Link href="/finishotp">
            <motion.button
              variants={fadeInUp}
              custom={3}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-blue-400/60 transition duration-300"
            >
              รีเซ็ตรหัสผ่าน
            </motion.button>
            </Link>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
