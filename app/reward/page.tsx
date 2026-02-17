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

  // Connect Wallet
  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []) as string[];
    if (accounts && accounts[0]) {
      setWalletAddress(accounts[0]);
    }
  }

  // Fetch Last Claim Timestamp
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

  // Claim Reward
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
      if (walletAddress) {
        fetchLastClaim(walletAddress);
      }
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Claim Failed ❌";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Format Countdown
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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-slate-800/80 backdrop-blur-lg border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.3)] rounded-2xl p-8 w-[420px] text-center transition-all duration-500">

          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Weekly Reward
          </h2>

          {!walletAddress ? (
            <button
              onClick={connectWallet}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl w-full font-semibold transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]"
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <p className="mb-3 text-sm break-words opacity-80">
                {walletAddress}
              </p>

              <div className="bg-slate-900/70 rounded-xl p-4 mb-6 border border-purple-500/20">
                <p className="text-lg font-semibold mb-2">
                  Reward: {rewardAmount}
                </p>

                {cooldownLeft > 0 ? (
                  <p className="text-red-400 text-sm">
                    Next claim in: {formatTime(cooldownLeft)}
                  </p>
                ) : (
                  <p className="text-green-400 text-sm">
                    You can claim now!
                  </p>
                )}
              </div>

              <button
                onClick={claimReward}
                disabled={loading || cooldownLeft > 0}
                className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  cooldownLeft > 0
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 hover:shadow-[0_0_25px_rgba(34,197,94,0.7)]"
                }`}
              >
                {loading ? "Claiming..." : "Claim Reward"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}