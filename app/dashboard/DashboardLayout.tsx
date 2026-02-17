"use client";

import React from "react";
import Sidebar from "../sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}