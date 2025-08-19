"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OtpPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [counter, setCounter] = useState(0);
  const router = useRouter();

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      alert("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก");
      return;
    }
    console.log("OTP ที่ส่ง:", code);
    router.push("/success");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [counter]);

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
            src="/Man.png"
            alt="OTP Verification"
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
            {/* Back Button */}
            <Link href="/resetpassword">
              <motion.button
                whileHover={{ x: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-6 px-3 py-2 
               rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                <span className="text-lg">←</span> กลับ
              </motion.button>
            </Link>

            {/* Title */}
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
              กรอกรหัส OTP
              <span className="block w-24 mx-auto mt-3 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></span>
            </h2>
            <p className="text-center text-gray-600 mb-8">
              รหัส OTP ถูกส่งไปยัง{" "}
              <span className="font-medium">66026099@gmail.com</span>
            </p>

            {/* OTP Inputs */}
            <div className="flex justify-between mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="w-12 h-12 rounded-xl border border-gray-300 text-center text-xl font-bold shadow-sm bg-white/90 focus:ring-2 focus:ring-blue-400 focus:shadow-xl transition-all"
                />
              ))}
            </div>

            {/* Resend OTP */}
            <div className="flex justify-between items-center text-sm mb-6 px-2">
              <span className="text-gray-500">ถ้าไม่ได้รับอีเมล?</span>
              <motion.button
                whileHover={counter === 0 ? { scale: 1.05 } : {}}
                whileTap={counter === 0 ? { scale: 0.95 } : {}}
                type="button"
                disabled={counter > 0}
                onClick={() => setCounter(30)}
                className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                  counter > 0
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                {counter > 0
                  ? `ส่งใหม่ได้อีกใน ${counter}s`
                  : "ส่งรหัสอีกครั้ง"}
              </motion.button>
            </div>

            {/* Submit Button */}
            <Link href="/password">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-400/60 transition-all duration-300"
            >
              ยืนยัน OTP
            </motion.button>
            </Link>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
