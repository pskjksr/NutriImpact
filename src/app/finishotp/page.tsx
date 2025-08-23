"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function OtpSuccessPage() {
  const router = useRouter();

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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: {} }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl w-full max-w-md p-10 border border-gray-200 hover:shadow-2xl transition-all duration-500 text-center"
      >
        {/* Title */}
        <motion.h1
          variants={fadeInUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="text-3xl font-extrabold text-gray-900 mb-4"
        >
          เสร็จสิ้น
          <span className="block w-24 mx-auto mt-3 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          custom={1}
          initial="hidden"
          animate="visible"
          className="text-gray-600 mb-8"
        >
          กรุณากลับไป เข้าสู่ระบบใหม่ อีกครั้ง
        </motion.p>

        <motion.button
          variants={fadeInUp}
          custom={2}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/Login")}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-blue-400/60 transition duration-300"
        >
          เข้าสู่ระบบ
        </motion.button>
      </motion.div>
    </div>
  );
}
