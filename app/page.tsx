"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden
                     bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">

      {/* Animated Name */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-8xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 
                   bg-clip-text text-transparent drop-shadow-lg text-center"
      >
        TempoX
      </motion.h1>

      {/* Animated Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        className="text-gray-200 mb-10 text-xl text-center max-w-xl"
      >
        Compare. Analyze. Launch on Testnets.
      </motion.p>

      {/* Animated Launch Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/dashboard")}
        className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 
                   rounded-2xl font-bold text-lg shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] 
                   transition-all duration-300"
      >
        Launch Dashboard 🚀
      </motion.button>

      {/* Optional Floating Particles or Glow */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* You can later add animated SVGs, gradients, or particles here */}
      </motion.div>
    </main>
  );
}