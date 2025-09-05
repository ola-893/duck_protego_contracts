const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("=============================================");
  console.log("  DuckChain: Protego.ai Deployment Script");
  console.log("=============================================");
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log("---------------------------------------------");
  console.log("🌐 Integrating with AI Unchained Hackathon Projects:");
  console.log("- 🦆 DuckChain: AI-powered TON blockchain");
  console.log("- 🤖 ChainGPT: AI-driven smart contract generation");
  console.log("- 🧠 ElizaOS: On-chain AI governance system");
  console.log("---------------------------------------------");

  // Deploy Mock USDC
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const usdc = await MockERC20.deploy("USD Coin", "USDC", 6);
  await usdc.deployed();
  console.log(`Mock USDC deployed to: ${usdc.address}`);

  // Deploy ProtegoInvoiceNFT
  const ProtegoInvoiceNFT = await ethers.getContractFactory("ProtegoInvoiceNFT");
  const invoiceNFT = await ProtegoInvoiceNFT.deploy();
  await invoiceNFT.deployed();
  console.log(`ProtegoInvoiceNFT deployed to: ${invoiceNFT.address}`);

  // Deploy ProtegoYieldVault
  const ProtegoYieldVault = await ethers.getContractFactory("ProtegoYieldVault");
  const vault = await ProtegoYieldVault.deploy(
    usdc.address,
    deployer.address, // Placeholder for custodian
    deployer.address, // Placeholder for AI agent
    "Protego Vault Shares",
    "pvs"
  );
  await vault.deployed();
  console.log(`ProtegoYieldVault deployed to: ${vault.address}`);
  
  // Deploy ProtegoMultiInvoiceNotes
  const ProtegoMultiInvoiceNotes = await ethers.getContractFactory("ProtegoMultiInvoiceNotes");
  const notes = await ProtegoMultiInvoiceNotes.deploy();
  await notes.deployed();
  console.log(`ProtegoMultiInvoiceNotes deployed to: ${notes.address}`);

  // Deploy ProtegoMasterVault
  const ProtegoMasterVault = await ethers.getContractFactory("ProtegoMasterVault");
  const masterVault = await ProtegoMasterVault.deploy(
    invoiceNFT.address,
    vault.address,
    notes.address
  );
  await masterVault.deployed();
  console.log(`ProtegoMasterVault deployed to: ${masterVault.address}`);

  console.log("=============================================");
  console.log("  ✅ Deployment Complete!");
  console.log("=============================================");
  console.log("Contract Addresses:");
  console.log(`  - Mock USDC: ${usdc.address}`);
  console.log(`  - ProtegoInvoiceNFT: ${invoiceNFT.address}`);
  console.log(`  - ProtegoYieldVault: ${vault.address}`);
  console.log(`  - ProtegoMultiInvoiceNotes: ${notes.address}`);
  console.log(`  - ProtegoMasterVault: ${masterVault.address}`);
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});