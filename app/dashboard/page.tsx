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

  /* ===========================
     FAUCET FUNCTION
  ============================ */

  const openFaucet = () => {
    window.open(
      "https://docs.tempo.xyz/quickstart/faucet?tab-1=fund-an-address",
      "_blank"
    );
  };

  /* ===========================
     ADD TEMPO NETWORK FUNCTION
  ============================ */

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

  /* ===========================
        CONNECT WALLET
  ============================ */

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
    <div className="min-h-screen flex bg-gradient-to-br from-[#0B1220] via-[#0F1B2D] to-[#0A1628] text-[#E6EDF3]">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00D4FF] to-[#5B8CFF] bg-clip-text text-transparent">
            Dashboard
          </h1>

          {walletAddress ? (
            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                ${
                  isWrongNetwork
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.25)]"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                }`}
              >
                {isWrongNetwork ? "Wrong Network" : "Tempo Connected"}
              </div>

              <div className="bg-[#111C2D] border border-[#1F2A3A] px-4 py-2 rounded-lg text-sm font-semibold text-[#E6EDF3]">
                {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-[#00D4FF] to-[#5B8CFF] 
              hover:opacity-90 px-4 py-2 rounded-lg font-semibold 
              text-black transition shadow-md 
              hover:shadow-[0_0_20px_rgba(0,212,255,0.35)]"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* SWITCH NETWORK BUTTON */}
        {isWrongNetwork && walletAddress && (
          <div className="mb-6">
            <button
              onClick={switchToTempo}
              className="bg-gradient-to-r from-[#00D4FF] to-[#5B8CFF] 
              px-6 py-3 rounded-xl font-semibold text-black
              hover:opacity-90 transition 
              shadow-[0_0_20px_rgba(0,212,255,0.35)]"
            >
              Switch to Tempo Testnet
            </button>
          </div>
        )}

        {/* STATS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: "Network", value: network || "Not Connected" },
            { label: "TEMP Balance", value: tempBalance },
            { label: "ALPHA Balance", value: alphaBalance },
            { label: "Latest Block", value: blockNumber ?? "Loading..." },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-[#111C2D]/80 p-6 rounded-xl border border-[#1F2A3A] 
              hover:shadow-[0_0_25px_rgba(0,212,255,0.15)] transition"
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-400">
                {item.label}
              </h2>
              <p className="text-[#00D4FF] font-bold">
                {item.value}
              </p>
            </div>
          ))}

          {/* FAUCET CARD */}
          <div
            className="bg-[#111C2D]/80 p-6 rounded-xl border border-[#1F2A3A] 
            hover:shadow-[0_0_25px_rgba(0,212,255,0.15)] transition"
          >
            <h2 className="text-lg font-semibold mb-2 text-gray-400">
              Testnet Faucet
            </h2>
            
            <button
              onClick={openFaucet}
              className="bg-gradient-to-r from-[#00D4FF] to-[#5B8CFF] 
              px-4 py-2 rounded-lg font-semibold text-black 
              hover:opacity-90 transition 
              shadow-[0_0_15px_rgba(0,212,255,0.35)]"
            >
              Claim Faucet
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}