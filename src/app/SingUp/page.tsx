"use client";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="grid md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl">
        {/* Left Side (Image/Illustration) */}
        <div className="hidden md:flex items-center justify-center bg-gray-100 p-6">
          <img
            src="/Human.png"
            alt="signup"
            className="rounded-xl object-cover"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="flex items-center justify-center w-full md:w-1/2 px-6 py-12 md:py-0">
          <form className="bg-white rounded-3xl shadow-xl w-full max-w-md p-10 border border-gray-200 transition-all duration-300 hover:shadow-2xl">
            {/* Title */}
            <div className="flex justify-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-black relative inline-block after:content-[''] after:block after:w-full after:border-b-4 after:border-black after:mt-2 drop-shadow-md">
                สร้างบัญชี
              </h2>
            </div>

            {/* Email */}
            <div className="mb-6">
              <input
                type="email"
                placeholder="อีเมล"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="รหัสผ่าน"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition duration-300"
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative mb-8">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="ยืนยันรหัสผ่าน"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition duration-300"
              >
                {showConfirm ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <Link href="/Login" className="block">
              <button
                type="button"
                className="w-full py-4 mb-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition transform hover:scale-105 hover:shadow-blue-500/50 duration-300"
              >
                สร้างบัญชี
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
