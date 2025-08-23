"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("ส่ง OTP ไปที่:", input);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-indigo-100 flex items-center justify-center px-6 py-10 font-sans">
      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl w-full max-w-md p-10 border border-gray-200 hover:shadow-2xl transition-all duration-500"
      >
        {/* Title */}
        <motion.div
          variants={fadeInUp}
          custom={0}
          className="flex justify-center mb-8"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 text-center">
            ลืมรหัสผ่าน
            <span className="block w-24 mx-auto mt-3 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></span>
          </h2>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          custom={1}
          className="text-center text-gray-600 mb-10 text-sm md:text-base leading-relaxed"
        >
          กรอกอีเมลหรือหมายเลขโทรศัพท์ของคุณ
          <br />
          เพื่อรับรหัส OTP สำหรับการตั้งรหัสผ่านใหม่
        </motion.p>

        {/* Input */}
        <motion.div variants={fadeInUp} custom={2} className="mb-6">
          <input
            type="text"
            placeholder="อีเมลหรือโทรศัพท์"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            className="w-full px-5 py-4 rounded-2xl bg-white/90 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm placeholder:text-gray-500 transition duration-300 hover:shadow-md focus:shadow-xl"
          />
        </motion.div>

        {/* Button */}
        <Link href="/OTP">
          <motion.button
            variants={fadeInUp}
            custom={3}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            className="w-full py-4 mb-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-400/60 transition-all duration-300"
          >
            รับรหัส OTP
          </motion.button>
        </Link>
      </motion.form>
    </div>
  );
}
