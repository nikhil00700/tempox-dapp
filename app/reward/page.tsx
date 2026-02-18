"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Sidebar from "../sidebar";
import { REWARD_ADDRESS, REWARD_ABI } from "@/app/lib/contracts";

export default function RewardPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [lastClaim, setLastClaim] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [cooldownLeft, setCooldownLeft] = useState<number>(0);

  const rewardAmount = "15 TEMP";
  const cooldownSeconds = 7 * 24 * 60 * 60;

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = (await provider.send("eth_requestAccounts", [])) as string[];
    if (accounts && accounts[0]) {
      setWalletAddress(accounts[0]);
    }
  }

  async function fetchLastClaim(address: string) {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      REWARD_ADDRESS,
      REWARD_ABI,
      provider
    );

    const timestamp = await contract.lastClaim(address);
    const last = Number(timestamp);
    setLastClaim(last);

    const now = Math.floor(Date.now() / 1000);
    const nextClaim = last + cooldownSeconds;

    if (now < nextClaim) {
      setCooldownLeft(nextClaim - now);
    } else {
      setCooldownLeft(0);
    }
  }

  async function claimReward() {
    if (!window.ethereum || !walletAddress) return;

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        REWARD_ADDRESS,
        REWARD_ABI,
        signer
      );

      const tx = await contract.claim();
      await tx.wait();

      alert("Reward Claimed Successfully ✅");
      fetchLastClaim(walletAddress);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Claim Failed ❌";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function formatTime(seconds: number): string {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  }

  useEffect(() => {
    if (walletAddress) {
      fetchLastClaim(walletAddress);
    }
  }, [walletAddress]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0A1628] via-[#0F1B2D] to-[#0B1220] text-[#E5E7EB]">
      <Sidebar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-[420px] rounded-3xl p-[1px] bg-gradient-to-r from-[#00D4FF]/40 to-[#5B8CFF]/40 hover:shadow-[0_0_45px_rgba(0,212,255,0.35)] transition-all duration-500">
          
          <div className="bg-[#0F172A]/95 backdrop-blur-xl border border-[#1F2A3A] rounded-3xl p-8 text-center">

            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#00D4FF] to-[#5B8CFF] bg-clip-text text-transparent">
              Weekly Reward
            </h2>

            {!walletAddress ? (
              <button
                onClick={connectWallet}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00D4FF] to-[#5B8CFF] text-black hover:shadow-[0_0_30px_rgba(0,212,255,0.65)] hover:scale-[1.02] transition-all duration-300"
              >
                Connect Wallet
              </button>
            ) : (
              <>
                <p className="mb-4 text-sm break-words opacity-70">
                  {walletAddress}
                </p>

                <div className="bg-[#111C2D] rounded-xl p-5 mb-6 border border-[#1F2A3A]">
                  <p className="text-lg font-semibold mb-2">
                    Reward: <span className="text-[#00D4FF]">{rewardAmount}</span>
                  </p>

                  {cooldownLeft > 0 ? (
                    <p className="text-rose-400 text-sm">
                      Next claim in: {formatTime(cooldownLeft)}
                    </p>
                  ) : (
                    <p className="text-emerald-400 text-sm">
                      You can claim now!
                    </p>
                  )}
                </div>

                <button
                  onClick={claimReward}
                  disabled={loading || cooldownLeft > 0}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    cooldownLeft > 0
                      ? "bg-[#162133] border border-[#1F2A3A] text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#00D4FF] to-[#5B8CFF] text-black hover:shadow-[0_0_30px_rgba(0,212,255,0.65)] hover:scale-[1.02]"
                  }`}
                >
                  {loading ? "Claiming..." : "Claim Reward"}
                </button>
              </>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}