"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password, confirmPassword });
    // TODO: call API -> ถ้าสำเร็จ redirect ไป login
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
      <div className="grid md:grid-cols-2 bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl border border-white/50">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="hidden md:flex items-center justify-center bg-gradient-to-br p-8"
        >
          <img
            src="/Human.png"
            alt="signup"
            className="rounded-2xl shadow-xl w-4/5 h-auto object-contain hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* Right Side (Form) */}
        <div className="flex items-center justify-center w-full px-6 py-12 md:py-0">
          <motion.form
            onSubmit={handleSignup}
            initial="hidden"
            animate="visible"
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl w-full max-w-md p-10 border border-gray-200 hover:shadow-2xl transition-all duration-500"
          >
            {/* Title */}
            <motion.div
              variants={fadeInUp}
              custom={0}
              className="flex justify-center mb-8"
            >
              <h2 className="text-4xl font-extrabold text-gray-900 text-center">
                สร้างบัญชี
                <span className="block w-24 mx-auto mt-3 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></span>
              </h2>
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeInUp} custom={1} className="mb-6">
              <input
                type="text"
                placeholder="อีเมล์หรือโทรศัพท์"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md placeholder:text-gray-500 transition-all duration-300 hover:shadow-lg focus:shadow-xl"
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeInUp} custom={2} className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="ป้อนรหัสผ่าน"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md placeholder:text-gray-500 transition pr-12 duration-300 hover:shadow-lg focus:shadow-xl"
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
            <motion.div variants={fadeInUp} custom={3} className="relative mb-6">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="ป้อนรหัสผ่านอีกครั้ง"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md placeholder:text-gray-500 transition pr-12 duration-300 hover:shadow-lg focus:shadow-xl"
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
            <Link
            href={"/Login"}>
            <motion.button
              variants={fadeInUp}
              custom={4}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-4 mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-blue-400/60 transition duration-300"
            >
              สร้างบัญชี
            </motion.button>
            </Link>
            {/* Already have account */}
            <motion.p
              variants={fadeInUp}
              custom={5}
              className="text-center text-gray-600 text-sm"
            >
            </motion.p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
