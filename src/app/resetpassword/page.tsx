"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("ส่ง OTP ไปที่:", input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex items-center justify-center px-6 py-10 font-sans">
      <div className="grid md:grid-cols-2 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl border border-white/40 hover:shadow-blue-300/50 transition-all duration-500">
        {/* Left side - Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex items-center justify-center bg-gradient-to-b from-white/20 to-white/60 p-8"
        >
          <img
            src="/Women.png"
            alt="Forgot Password"
            className="rounded-2xl shadow-xl w-4/5 h-auto object-contain hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* Right side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center w-full px-8 py-12"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl w-full max-w-md p-10 border border-gray-200 hover:shadow-2xl transition-all duration-500"
          >
            {/* Title */}
            <div className="flex justify-center mb-8">
              <h2 className="text-4xl font-extrabold text-gray-900 relative text-center">
                ลืมรหัสผ่าน
                <span className="block w-24 mx-auto mt-3 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></span>
              </h2>
            </div>

            <p className="text-center text-gray-600 mb-10 text-sm md:text-base leading-relaxed">
              กรอกอีเมลหรือหมายเลขโทรศัพท์ของคุณ
              <br />
              เพื่อรับรหัส OTP สำหรับการตั้งรหัสผ่านใหม่
            </p>

            {/* Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="อีเมล์หรือโทรศัพท์"
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                className="w-full px-5 py-4 rounded-2xl bg-white/90 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm placeholder:text-gray-500 transition duration-300 hover:shadow-md focus:shadow-xl"
              />
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-4 mb-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-400/60 transition-all duration-300"
            >
              รับรหัส OTP
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
