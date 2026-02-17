"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import { SiX } from "react-icons/si"; // X (Twitter) icon

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } bg-slate-900 border-r border-purple-500/20 transition-all duration-300 flex flex-col`}
    >
      {/* Top Section: Title + Nav */}
      <div>
        <div className="p-4 flex justify-between items-center">
          {open && (
            <h1 className="text-xl font-bold text-purple-400">
              Tempo dApp
            </h1>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="text-purple-400 text-lg font-bold"
          >
            ☰
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/dashboard"
            className={`p-3 rounded-lg transition ${
              pathname === "/dashboard"
                ? "bg-purple-600"
                : "hover:bg-slate-800"
            }`}
          >
            {open ? "Dashboard" : "🏠"}
          </Link>

          <Link
            href="/swap"
            className={`p-3 rounded-lg transition ${
              pathname === "/swap"
                ? "bg-purple-600"
                : "hover:bg-slate-800"
            }`}
          >
            {open ? "Swap" : "🔄"}
          </Link>

          <Link
            href="/reward"
            className={`p-3 rounded-lg transition ${
              pathname === "/reward"
                ? "bg-purple-600"
                : "hover:bg-slate-800"
            }`}
          >
            {open ? "Reward" : "🎁"}
          </Link>
        </nav>
      </div>

      {/* Bottom Section: Social / Contact Icons */}
      <div className="flex justify-center gap-4 p-4 border-t border-purple-500/20 mt-auto">
        <a
          href="https://github.com/nikhil00700"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-purple-400 transition"
        >
          <FaGithub size={20} />
        </a>

        <a
          href="mailto:TempoX.info@gmail.com"
          className="text-white hover:text-purple-400 transition"
        >
          <FaEnvelope size={20} />
        </a>

        <a
          href="https://x.com/TempoX_App" // replace with your X link later
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-purple-400 transition"
        >
          <SiX size={20} />
        </a>
      </div>
    </div>
  );
}