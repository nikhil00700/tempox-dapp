"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Sidebar from "../sidebar";
import {
  TEMP_ADDRESS,
  ALPHA_ADDRESS,
  SWAP_ADDRESS,
  ERC20_ABI,
  SWAP_ABI,
} from "@/app/lib/contracts";

export default function Swap() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tempBalance, setTempBalance] = useState("0");
  const [alphaBalance, setAlphaBalance] = useState("0");
  const [allowance, setAllowance] = useState<bigint>(0n);

  const calculateReceiveAmount = () => {
    if (!amount) return "0.0";
    const value = Number(amount);
    const afterFee = value * 0.995;
    return afterFee.toFixed(4);
  };

  const getProvider = async () => {
    if (!window.ethereum) throw new Error("MetaMask not found");
    return new ethers.BrowserProvider(window.ethereum);
  };

  const getSigner = async () => {
    const provider = await getProvider();
    return provider.getSigner();
  };

  const connectWallet = async () => {
    try {
      const provider = await getProvider();
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      await refreshBalances(accounts[0], provider);
      await checkAllowance(accounts[0], provider);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshBalances = async (
    address?: string,
    provider?: ethers.BrowserProvider
  ) => {
    const prov = provider || (await getProvider());
    const userAddress = address || walletAddress;
    if (!userAddress) return;

    const tempContract = new ethers.Contract(TEMP_ADDRESS, ERC20_ABI, prov);
    const alphaContract = new ethers.Contract(ALPHA_ADDRESS, ERC20_ABI, prov);

    const tempBal = await tempContract.balanceOf(userAddress);
    const alphaBal = await alphaContract.balanceOf(userAddress);

    setTempBalance(ethers.formatUnits(tempBal, 18));
    setAlphaBalance(ethers.formatUnits(alphaBal, 18));
  };

  const checkAllowance = async (
    address?: string,
    provider?: ethers.BrowserProvider
  ) => {
    if (!amount) {
      setAllowance(0n);
      return;
    }

    const prov = provider || (await getProvider());
    const userAddress = address || walletAddress;
    if (!userAddress) return;

    const tokenAddress = isReversed ? ALPHA_ADDRESS : TEMP_ADDRESS;
    const token = new ethers.Contract(tokenAddress, ERC20_ABI, prov);

    const allowed = await token.allowance(userAddress, SWAP_ADDRESS);
    setAllowance(allowed);
  };

  const approveToken = async () => {
    try {
      if (!amount) return;
      setLoading(true);

      const signer = await getSigner();
      const tokenAddress = isReversed ? ALPHA_ADDRESS : TEMP_ADDRESS;
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await token.approve(SWAP_ADDRESS, parsedAmount);
      await tx.wait();

      alert("✅ Approval successful");
      await checkAllowance();
    } catch (err) {
      console.error(err);
      alert("❌ Approval failed");
    } finally {
      setLoading(false);
    }
  };

  const swapTokens = async () => {
    try {
      if (!amount) return;
      setLoading(true);

      const signer = await getSigner();
      const swap = new ethers.Contract(SWAP_ADDRESS, SWAP_ABI, signer);
      const parsedAmount = ethers.parseUnits(amount, 18);

      const tx = isReversed
        ? await swap.swapAlphaToTemp(parsedAmount)
        : await swap.swapTempToAlpha(parsedAmount);

      await tx.wait();
      alert("✅ Swap successful");

      setAmount("");
      await refreshBalances();
      await checkAllowance();
    } catch (err: any) {
      console.error(err);
      alert(err?.reason || "❌ Swap failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      checkAllowance();
    }
  }, [amount, isReversed]);

  const parsedAmount = amount
    ? ethers.parseUnits(amount || "0", 18)
    : 0n;

  const needsApproval = allowance < parsedAmount;

  const renderActionButton = () => {
    if (!walletAddress) {
      return (
        <button
          onClick={connectWallet}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          Connect Wallet
        </button>
      );
    }

    if (needsApproval) {
      return (
        <button
          onClick={approveToken}
          disabled={loading || !amount}
          className="w-full py-3 rounded-xl bg-[#1F2937] hover:bg-[#374151] disabled:opacity-50 font-semibold"
        >
          {loading ? "Processing..." : "Approve"}
        </button>
      );
    }

    return (
      <button
        onClick={swapTokens}
        disabled={loading || !amount}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 disabled:opacity-50 font-semibold hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]"
      >
        {loading ? "Processing..." : "Swap"}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0B1220] via-[#0F1B2D] to-[#0A1628] text-[#E5E7EB]">
      <Sidebar />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative w-full max-w-md rounded-3xl p-[2px] bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.45)] transition-all duration-300">
          <div className="bg-[#0F172A]/95 backdrop-blur-xl p-6 rounded-3xl space-y-6">
            <h2 className="text-2xl font-bold text-center text-indigo-400">
              Token Swap
            </h2>

            <div className="bg-[#111827] p-4 rounded-xl relative">
              <p className="text-sm text-gray-400 mb-1">
                From ({isReversed ? "ALPHA" : "TEMP"})
              </p>
              <input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-2xl outline-none"
              />
              <span className="absolute top-4 right-4 text-sm text-indigo-400">
                {isReversed ? alphaBalance : tempBalance}
              </span>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setIsReversed(!isReversed)}
                className="bg-[#1F2937] rounded-full p-2 hover:bg-[#374151] transition"
              >
                ⇅
              </button>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl relative">
              <p className="text-sm text-gray-400">
                To ({isReversed ? "TEMP" : "ALPHA"})
              </p>
              <p className="text-2xl mt-2 text-indigo-400 font-semibold">
                {calculateReceiveAmount()}
              </p>
              <span className="absolute top-4 right-4 text-sm text-indigo-400">
                {isReversed ? tempBalance : alphaBalance}
              </span>
            </div>

            <div>{renderActionButton()}</div>
          </div>
        </div>
      </main>
    </div>
  );
}