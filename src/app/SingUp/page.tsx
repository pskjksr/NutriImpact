"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaSignInAlt } from "react-icons/fa";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email.trim()) newErrors.email = "กรุณากรอกอีเมลหรือเบอร์โทรศัพท์";
    if (!password.trim()) newErrors.password = "กรุณากรอกรหัสผ่าน";
    if (!confirmPassword.trim()) {
      newErrors.confirm = "กรุณากรอกรหัสผ่านอีกครั้ง";
    } else if (password !== confirmPassword) {
      newErrors.confirm = "รหัสผ่านไม่ตรงกัน";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === "admin@example.com" && password === "123456") {
        alert("สมัครสำเร็จ! คุณสามารถเข้าสู่ระบบได้");
        router.push("/Login");
      } else {
        setErrors({
          general: "สำหรับตัวอย่าง ให้ใช้ admin@example.com / 123456",
        });
      }
    }, 1000);
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
        {/* Left */}
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

        {/* Right Form */}
        <div className="flex items-center justify-center w-full px-6 py-12 md:py-0">
          <motion.form
            onSubmit={handleSignup}
            initial="hidden"
            animate="visible"
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl w-full max-w-md p-10 border border-gray-200 hover:shadow-2xl transition-all duration-500"
          >
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
            <motion.div
              variants={fadeInUp}
              custom={2}
              className="relative mb-6"
            >
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

            {/* Confirm Password */}
            <motion.div
              variants={fadeInUp}
              custom={3}
              className="relative mb-6"
            >
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="ป้อนรหัสผ่านอีกครั้ง"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  className={`w-full pr-12 px-5 py-4 rounded-2xl bg-white/90 border ${
                    errors.confirm ? "border-red-500" : "border-gray-200"
                  } focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm placeholder:text-gray-500 transition duration-300 hover:shadow-md focus:shadow-xl h-12`}
                />
                {/* ปุ่มตา */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowConfirm((prev) => !prev);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition duration-300"
                >
                  {showConfirm ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* error message */}
              {errors.confirm && (
                <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
              )}
            </motion.div>

            <motion.button
              variants={fadeInUp}
              custom={4}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-blue-400/60 transition duration-300 disabled:opacity-60"
            >
              {loading ? "กำลังสมัคร..." : "สร้างบัญชี"}
            </motion.button>

            {errors.general && (
              <p className="text-red-500 text-center text-sm mb-4">
                {errors.general}
              </p>
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
      </div>
    </div>
  );
}
