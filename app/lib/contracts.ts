// app/lib/contracts.ts

// ------------------------
// Deployed Contract Addresses (WORKING VERSION)
// ------------------------

export const TEMP_ADDRESS   = "0x89aAE49979Bdd8Ad3d920DCAf9A8eF1e554D7faC";
export const ALPHA_ADDRESS  = "0xf2a7750dc0Bc5Dc84dcA4b50209230421ff254Bc";
export const SWAP_ADDRESS   = "0x1b89CABB993D1cbED627389bE7482707E05a6A00";
export const REWARD_ADDRESS = "0xccD21B2C9192f35D9525E27865F27088d16ef70b";

// ------------------------
// ERC20 ABI (TEMP & ALPHA)
// ------------------------

export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// ------------------------
// Swap Contract ABI (YOUR WORKING CONTRACT)
// ------------------------

export const SWAP_ABI = [
  "function swapTempToAlpha(uint256 amount) external",
  "function swapAlphaToTemp(uint256 amount) external"
];

// ------------------------
// Weekly Reward ABI (YOUR WORKING CONTRACT)
// ------------------------

export const REWARD_ABI = [
  "function claim() external",
  "function lastClaim(address user) view returns (uint256)"
];