"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { motion } from "framer-motion";

// LoginPage component
export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password, remember });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-blue-100 via-blue-50 to-blue-50">
      {/* Left side - Animated Text */}
      <div className="w-full md:w-1/2 hidden md:flex justify-center items-center p-12 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-md text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg"
          >
            <span className="inline-block relative after:content-[''] after:block after:w-full after:border-b-4 after:border-white after:mt-3">
              ยินดีต้อนรับเข้าสู่
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="text-lg md:text-xl leading-relaxed opacity-90"
          >
            ศึกษาความเครียดจากการเรียนที่อาจส่งผลต่อการรับประทานอาหารในแต่ละวัน
            และศึกษาผลจากการรับประทานอาหารต่างๆ ที่ส่งผลต่อ
            สุขภาวะทางกายและทางจิตใจ
          </motion.p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 md:py-0">
        <form
          onSubmit={handleLogin}
          className="bg-white/20 backdrop-blur-3xl rounded-3xl shadow-2xl w-full max-w-md p-10 border border-white/30 transition-all duration-300 hover:shadow-3xl"
        >
          {/* Title */}
          <div className="flex justify-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-black relative inline-block after:content-[''] after:block after:w-full after:border-b-4 after:border-black after:mt-2 drop-shadow-md">
              เข้าสู่ระบบ
            </h2>
          </div>

          {/* Email */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="อีเมล์หรือโทรศัพท์"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full px-5 py-4 rounded-2xl bg-white/90 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md placeholder:text-gray-500 transition duration-300 hover:shadow-xl focus:shadow-xl"
            />
          </div>

          {/* Password with toggle */}
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="ป้อนรหัสผ่าน"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="w-full px-5 py-4 rounded-2xl bg-white/90 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md placeholder:text-gray-500 transition pr-12 duration-300 hover:shadow-xl focus:shadow-xl"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword((prev) => !prev);
              }}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition duration-300"
            >
              {showPassword ? (
                <EyeIcon className="w-5 h-5 animate-bounce" />
              ) : (
                <EyeSlashIcon className="w-5 h-5 animate-pulse" />
              )}
            </button>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between mb-8 text-sm">
            <label className="flex items-center gap-3 text-black/90 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setRemember(e.target.checked)
                }
                className="w-5 h-5 rounded-lg text-blue-600 focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
              จดจำการเข้าสู่ระบบ
            </label>
            <a
              href="#"
              className="text-black/80 hover:text-blue-600 hover:underline transition duration-200"
            >
              ลืมรหัสผ่าน ?
            </a>
          </div>

          {/* Buttons */}
          <button
            type="submit"
            className="w-full py-4 mb-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition transform hover:scale-105 hover:shadow-blue-500/50 duration-300"
          >
            เข้าสู่ระบบ
          </button>

          <Link href="/SingUp">
            <button
              type="button"
              className="w-full py-4 bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold rounded-2xl shadow-lg hover:from-green-500 hover:to-green-600 transition transform hover:scale-105 hover:shadow-green-400/50 duration-300"
            >
              ลงทะเบียน
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
