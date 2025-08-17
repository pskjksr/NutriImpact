"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SignupForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password, confirmPassword });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-100 px-4 py-10 flex justify-center font-sans">
      <div className="grid md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl">
        {/* Left Side */}
        <div className="hidden md:flex items-center justify-center bg-white p-6">
          <img
            src="/Human.png"
            alt="signup"
            className="rounded-xl object-cover"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="flex items-center justify-center w-full px-6 py-12 md:py-0">
          <form
            onSubmit={handleSignup}
            className="bg-white rounded-3xl shadow-xl w-full max-w-md p-10 border border-gray-200 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-black relative inline-block after:content-[''] after:block after:w-full after:border-b-4 after:border-black after:mt-2 drop-shadow-md">
                สร้างบัญชี
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

            {/* Password */}
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

            {/* Confirm Password */}
            <div className="relative mb-6">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="ป้อนรหัสผ่านอีกครั้ง"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full px-5 py-4 rounded-2xl bg-white/90 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md placeholder:text-gray-500 transition pr-12 duration-300 hover:shadow-xl focus:shadow-xl"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowConfirm((prev) => !prev);
                }}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition duration-300"
              >
                {showConfirm ? (
                  <EyeIcon className="w-5 h-5 animate-bounce" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5 animate-pulse" />
                )}
              </button>
            </div>

            {/* Submit */}
            <Link href={"/Login"}>
              <button
                type="submit"
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
