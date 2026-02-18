"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const name = "TempoX";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden
                     bg-gradient-to-br from-[#0B1220] via-[#0F1B2D] to-[#0A1628] text-gray-100">

      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.08),transparent_70%)] pointer-events-none" />

      {/* Animated Logo Text */}
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 flex"
      >
        {name.split("").map((letter, index) => (
          <motion.span
            key={index}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-r from-[#00D4FF] via-[#5B8CFF] to-[#00D4FF] 
                       bg-clip-text text-transparent"
          >
            {letter}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-gray-400 text-lg md:text-xl text-center max-w-xl mb-12 px-4"
      >
        Seamless token swapping & rewards on Tempo Testnet.
        <br className="hidden md:block" />
        Built for speed. Designed for precision.
      </motion.p>

      {/* Professional Launch Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 30px rgba(0,212,255,0.4)",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/dashboard")}
        className="px-10 py-4 rounded-2xl font-semibold text-lg
                   bg-gradient-to-r from-[#00D4FF] to-[#5B8CFF]
                   text-black
                   shadow-lg transition-all duration-300"
      >
        Enter App →
      </motion.button>

      {/* Bottom Soft Glow Line */}
      <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r 
                      from-transparent via-[#00D4FF]/40 to-transparent" />
    </main>
  );
}