"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import { SiX } from "react-icons/si";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "Swap", href: "/swap", icon: "🔄" },
    { name: "Reward", href: "/reward", icon: "🎁" },
  ];

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } bg-[#0F1B2D] border-r border-[#1F2A3A] transition-all duration-300 flex flex-col`}
    >
      {/* Top Section */}
      <div>
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          {open && (
            <h1 className="text-lg font-semibold tracking-wide bg-gradient-to-r from-[#00D4FF] to-[#5B8CFF] bg-clip-text text-transparent">
              TempoX
            </h1>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="text-gray-400 hover:text-[#00D4FF] transition text-lg"
          >
            ☰
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 mt-2">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                  ${
                    active
                      ? "bg-[#111C2D] text-[#00D4FF]"
                      : "text-gray-400 hover:bg-[#111C2D] hover:text-gray-200"
                  }`}
              >
                {/* Active Left Indicator */}
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#00D4FF]" />
                )}

                <span className="text-lg">{item.icon}</span>
                {open && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-center gap-5 p-4 border-t border-[#1F2A3A] mt-auto">
        <a
          href="https://github.com/nikhil00700"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-[#00D4FF] transition"
        >
          <FaGithub size={18} />
        </a>

        <a
          href="mailto:TempoX.info@gmail.com"
          className="text-gray-400 hover:text-[#00D4FF] transition"
        >
          <FaEnvelope size={18} />
        </a>

        <a
          href="https://x.com/TempoX_App"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-[#00D4FF] transition"
        >
          <SiX size={18} />
        </a>
      </div>
    </div>
  );
}