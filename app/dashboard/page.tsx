"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Sidebar from "../sidebar";
import { TEMP_ADDRESS, ALPHA_ADDRESS, ERC20_ABI } from "@/app/lib/contracts";

const TEMPO_CHAIN_ID = 42431;
const TEMPO_CHAIN_HEX = "0x" + TEMPO_CHAIN_ID.toString(16);

export default function Dashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState("");
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [tempBalance, setTempBalance] = useState("0");
  const [alphaBalance, setAlphaBalance] = useState("0");
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const getProvider = () => {
    if (!window.ethereum) throw new Error("No wallet found");
    return new ethers.BrowserProvider(window.ethereum);
  };

  // Fetch latest block
  useEffect(() => {
    const fetchBlock = async () => {
      if (!window.ethereum) return;
      const provider = getProvider();
      const currentBlock = await provider.getBlockNumber();
      setBlockNumber(currentBlock);
    };

    fetchBlock();
    const interval = setInterval(fetchBlock, 5000);
    return () => clearInterval(interval);
  }, []);

  // Listen for wallet changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = () => connectWallet();
    const handleChainChanged = () => connectWallet();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const addTempoNetwork = async () => {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: TEMPO_CHAIN_HEX,
          chainName: "Tempo Testnet (Moderato)",
          rpcUrls: ["https://rpc.moderato.tempo.xyz"],
          nativeCurrency: {
            name: "USD",
            symbol: "USD",
            decimals: 18,
          },
          blockExplorerUrls: ["https://explore.tempo.xyz"],
        },
      ],
    });
  };

  const switchToTempo = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: TEMPO_CHAIN_HEX }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await addTempoNetwork();
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    try {
      const provider = getProvider();
      const accounts = await provider.send("eth_requestAccounts", []);
      const networkInfo = await provider.getNetwork();

      setWalletAddress(accounts[0]);

      const correct = Number(networkInfo.chainId) === TEMPO_CHAIN_ID;
      setIsWrongNetwork(!correct);
      setNetwork(correct ? "Tempo Testnet" : networkInfo.name);

      if (!correct) return;

      const signer = await provider.getSigner();
      const tempContract = new ethers.Contract(
        TEMP_ADDRESS,
        ERC20_ABI,
        signer
      );
      const alphaContract = new ethers.Contract(
        ALPHA_ADDRESS,
        ERC20_ABI,
        signer
      );

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
            <div className="flex items-center gap-3">

              {/* Animated Network Badge */}
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                ${
                  isWrongNetwork
                    ? "bg-red-600 animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.7)]"
                    : "bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.7)]"
                }`}
              >
                {isWrongNetwork ? "Wrong Network" : "Tempo Connected"}
              </div>

              <div className="bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold">
                {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
              </div>
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

        {isWrongNetwork && walletAddress && (
          <div className="mb-6">
            <button
              onClick={switchToTempo}
              className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-[0_0_20px_rgba(168,85,247,0.7)]"
            >
              Switch to Tempo Testnet
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/70 p-6 rounded-xl border border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition">
            <h2 className="text-lg font-semibold mb-2">Network</h2>
            <p className="text-purple-400 font-bold">
              {network || "Not Connected"}
            </p>
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
              {blockNumber ?? "Loading..."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}