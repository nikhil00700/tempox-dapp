"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Sidebar from "../sidebar";
import { TEMP_ADDRESS, ALPHA_ADDRESS, ERC20_ABI } from "@/app/lib/contracts";

const TEMPO_CHAIN_ID = 42431;

export default function Dashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState("");
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [tempBalance, setTempBalance] = useState("0");
  const [alphaBalance, setAlphaBalance] = useState("0");
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  // Fetch latest block
  useEffect(() => {
    const fetchBlock = async () => {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const currentBlock = await provider.getBlockNumber();
      setBlockNumber(currentBlock);
    };
    fetchBlock();
    const interval = setInterval(fetchBlock, 5000);
    return () => clearInterval(interval);
  }, []);

  // Connect wallet & fetch balances
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const networkInfo = await provider.getNetwork();

      setWalletAddress(accounts[0]);
      setNetwork(
        Number(networkInfo.chainId) === TEMPO_CHAIN_ID
          ? "Tempo Testnet"
          : networkInfo.name
      );
      setIsWrongNetwork(Number(networkInfo.chainId) !== TEMPO_CHAIN_ID);

      // Load token balances
      const signer = await provider.getSigner();
      const tempContract = new ethers.Contract(TEMP_ADDRESS, ERC20_ABI, signer);
      const alphaContract = new ethers.Contract(ALPHA_ADDRESS, ERC20_ABI, signer);

      const tempBal = await tempContract.balanceOf(accounts[0]);
      const alphaBal = await alphaContract.balanceOf(accounts[0]);

      setTempBalance(ethers.formatUnits(tempBal, 18));
      setAlphaBalance(ethers.formatUnits(alphaBal, 18));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-400 drop-shadow-lg">
            Dashboard
          </h1>

          {walletAddress ? (
            <div className="bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold transition shadow-md hover:shadow-blue-400/50"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {isWrongNetwork && (
          <div className="bg-red-600 p-4 rounded-lg mb-6 text-sm font-semibold">
            ⚠ Wrong Network Detected. Switch to Tempo Testnet.
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/70 p-6 rounded-xl border border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition">
            <h2 className="text-lg font-semibold mb-2">Network</h2>
            <p className="text-purple-400 font-bold">{network || "Not Connected"}</p>
          </div>

          <div className="bg-slate-800/70 p-6 rounded-xl border border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition">
            <h2 className="text-lg font-semibold mb-2">TEMP Balance</h2>
            <p className="text-purple-400 font-bold">{tempBalance}</p>
          </div>

          <div className="bg-slate-800/70 p-6 rounded-xl border border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition">
            <h2 className="text-lg font-semibold mb-2">ALPHA Balance</h2>
            <p className="text-purple-400 font-bold">{alphaBalance}</p>
          </div>

          <div className="bg-slate-800/70 p-6 rounded-xl border border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition">
            <h2 className="text-lg font-semibold mb-2">Latest Block</h2>
            <p className="text-purple-400 font-bold">
              {blockNumber ? blockNumber : "Loading..."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}