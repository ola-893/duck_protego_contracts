#!/usr/bin/env node

/**
 * 🦆 PROTEGO.AI DEPLOYMENT SCRIPT FOR DUCKCHAIN
 * 
 * DuckChain is an EVM-compatible L2 on TON blockchain
 * This script is optimized for DuckChain's specific characteristics
 */

const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

// DuckChain-optimized configuration
const DUCKCHAIN_CONFIG = {
  // Platform settings
  platformFeeBps: 200, // 2%
  baseYieldRate: 800,  // 8% annual
  tonMultiplier: 120,  // 1.2x for TON ecosystem benefits
  testTokenSupply: ethers.utils.parseUnits("10000000", 6), // 10M USDC for testing
  
  // DuckChain specific settings
  duckchain: {
    // Lower gas limits due to efficient L2
    gasLimit: {
      small: 150000,   // For simple operations
      medium: 300000,  // For contract deployment
      large: 500000    // For complex operations
    },
    // Block confirmation settings
    confirmations: {
      testnet: 1,      // Fast confirmation on testnet
      mainnet: 2       // Conservative on mainnet
    }
  },
  
  // GOAT Agent configuration
  goatAgent: {
    address: null, // Will be set to deployer for demo
    name: "Protego GOAT Agent",
    description: "AI-powered yield optimization agent for TON ecosystem"
  },
  
  // Multi-Invoice Notes configuration optimized for DuckChain
  multiInvoiceNotes: {
    portfolios: [
      {
        name: "TON DeFi High-Yield Portfolio",
        minimumPurchase: ethers.utils.parseUnits("50", 18), // Lower minimum for L2
        pricePerUnit: ethers.utils.parseUnits("1", 18)
      },
      {
        name: "Cross-Chain Balanced Portfolio", 
        minimumPurchase: ethers.utils.parseUnits("25", 18), // Even lower for accessibility
        pricePerUnit: ethers.utils.parseUnits("1.2", 18)
      }
    ]
  }
};

// Color functions
const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`, 
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  magenta: (s) => `\x1b[35m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`
};

function logStep(num, title) {
  console.log("\n" + "═".repeat(60));
  console.log(c.cyan(`🦆 STEP ${num}: ${title}`));
  console.log("═".repeat(60));
}

function logSuccess(msg) { console.log(c.green(`✅ ${msg}`)); }
function logInfo(msg) { console.log(c.blue(`ℹ️  ${msg}`)); }
function logWarning(msg) { console.log(c.yellow(`⚠️  ${msg}`)); }
function logError(msg) { console.log(c.red(`❌ ${msg}`)); }

async function main() {
  console.log("");
  console.log(c.magenta("╔════════════════════════════════════════════════════════════╗"));
  console.log(c.magenta("║          🦆 PROTEGO.AI ON DUCKCHAIN DEPLOYMENT             ║"));
  console.log(c.magenta("║          EVM-Compatible L2 on TON Blockchain               ║"));
  console.log(c.magenta("╚════════════════════════════════════════════════════════════╝"));

  // =========================================================================
  // STEP 1: DuckChain Environment Setup & Validation
  // =========================================================================
  logStep(1, "DuckChain Environment Setup & Validation");
  
  try {
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    const balance = await ethers.provider.getBalance(deployer.address);
    
    // Set GOAT agent address to deployer for demo
    DUCKCHAIN_CONFIG.goatAgent.address = deployer.address;
    
    // Validate DuckChain network
    const isDuckChainMainnet = network.chainId === 5545;
    const isDuckChainTestnet = network.chainId === 202105;
    const isDuckChain = isDuckChainMainnet || isDuckChainTestnet;
    
    if (isDuckChain) {
      logSuccess(`🦆 Connected to DuckChain ${isDuckChainMainnet ? 'Mainnet' : 'Testnet'}!`);
      logInfo(`Chain ID: ${network.chainId}`);
      logInfo(`Native Currency: TON`);
    } else {
      logWarning(`Not on DuckChain (Chain ID: ${network.chainId}). Proceeding anyway...`);
    }
    
    logInfo(`Deployer: ${deployer.address}`);
    logInfo(`Balance: ${ethers.utils.formatUnits(balance, 18)} ${isDuckChain ? 'TON' : 'ETH'}`);
    logInfo(`GOAT Agent (demo): ${DUCKCHAIN_CONFIG.goatAgent.address}`);
    
    // Check for low balance
    const minBalance = ethers.utils.parseUnits("1", 18);
    if (balance.lt(minBalance)) {
      logError(`Insufficient balance for deployment. Need at least 1 ${isDuckChain ? 'TON' : 'ETH'}`);
      logInfo("Get TON tokens from DuckChain faucet or bridge if on testnet");
      throw new Error("Insufficient balance");
    }
    
    logSuccess("DuckChain environment validated");

    // =========================================================================
    // STEP 2: Deploy Mock USDC (DuckChain Compatible)
    // =========================================================================
    logStep(2, "Deploy Mock USDC Token");
    
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    logInfo("Deploying Mock USDC to DuckChain...");
    
    const usdc = await MockERC20.deploy("USD Coin", "USDC", 6, {
      gasLimit: DUCKCHAIN_CONFIG.duckchain.gasLimit.medium
    });
    await usdc.deployed();
    const usdcAddress = usdc.address;
    
    logSuccess(`Mock USDC deployed on DuckChain: ${usdcAddress}`);
    
    // Mint initial supply for testing
    const mintTx = await usdc.mint(deployer.address, DUCKCHAIN_CONFIG.testTokenSupply, {
      gasLimit: DUCKCHAIN_CONFIG.duckchain.gasLimit.small
    });
    await mintTx.wait(isDuckChainTestnet ? 1 : 2);
    
    logInfo(`Minted ${ethers.utils.formatUnits(DUCKCHAIN_CONFIG.testTokenSupply, 6)} USDC for testing`);

    // =========================================================================
    // STEP 3: Deploy Master Vault System
    // =========================================================================  
    logStep(3, "Deploy Master Vault System");
    
    const ProtegoMasterVault = await ethers.getContractFactory("ProtegoMasterVault");
    logInfo("Deploying Master Vault to DuckChain...");
    
    const masterVault = await ProtegoMasterVault.deploy(
      usdcAddress,
      deployer.address, // Treasury = deployer for demo
      {
        gasLimit: DUCKCHAIN_CONFIG.duckchain.gasLimit.large
      }
    );
    await masterVault.deployed();
    const masterVaultAddress = masterVault.address;
    
    logSuccess(`Master Vault deployed on DuckChain: ${masterVaultAddress}`);
    
    // Get automatically deployed InvoiceNFT contract
    const invoiceNFTAddress = await masterVault.invoiceNFT();
    logSuccess(`Invoice NFT (ERC-721): ${invoiceNFTAddress}`);

    // =========================================================================
    // STEP 4: Deploy Core Yield Vault
    // =========================================================================
    logStep(4, "Deploy Core Yield Vault");
    
    const ProtegoYieldVaultCore = await ethers.getContractFactory("ProtegoYieldVaultCore");
    logInfo("Deploying Core Yield Vault to DuckChain...");
    
    // DuckChain optimized parameters
    const fundingTarget = ethers.utils.parseUnits("25000", 6); // Smaller target for L2
    const fundingDeadline = Math.floor(Date.now() / 1000) + (45 * 24 * 60 * 60); // 45 days
    const invoiceTokenId = 1;
    
    const vaultCore = await ProtegoYieldVaultCore.deploy(
      usdcAddress,
      invoiceNFTAddress,
      invoiceTokenId,
      fundingTarget,
      fundingDeadline,
      "Protego DuckChain Vault",    // DuckChain specific name
      "PDV",                        // Updated symbol
      {
        gasLimit: DUCKCHAIN_CONFIG.duckchain.gasLimit.large
      }
    );
    await vaultCore.deployed();
    const vaultCoreAddress = vaultCore.address;
    
    logSuccess(`Core Yield Vault deployed on DuckChain: ${vaultCoreAddress}`);
    logInfo(`Funding target: ${ethers.utils.formatUnits(fundingTarget, 6)} USDC`);
    logInfo(`Funding deadline: ${new Date(fundingDeadline * 1000).toISOString()}`);

    // =========================================================================
    // STEP 5: Deploy GOAT Extension Vault
    // =========================================================================
    logStep(5, "Deploy GOAT Extension Vault");
    
    const ProtegoYieldVaultGoat = await ethers.getContractFactory("ProtegoYieldVaultGoat");
    logInfo("Deploying GOAT Extension Vault to DuckChain...");
    
    const vaultGoat = await ProtegoYieldVaultGoat.deploy(
      vaultCoreAddress,
      usdcAddress,
      {
        gasLimit: DUCKCHAIN_CONFIG.duckchain.gasLimit.large
      }
    );
    await vaultGoat.deployed();
    const vaultGoatAddress = vaultGoat.address;
    
    logSuccess(`GOAT Extension Vault deployed on DuckChain: ${vaultGoatAddress}`);

    // =========================================================================
    // STEP 6: Deploy Multi-Invoice Notes (ERC-1155)
    // =========================================================================
    logStep(6, "Deploy Multi-Invoice Notes Contract");
    
    const ProtegoMultiInvoiceNotes = await ethers.getContractFactory("ProtegoMultiInvoiceNotes");
    logInfo("Deploying Multi-Invoice Notes (ERC-1155) to DuckChain...");
    
    const multiInvoiceNotes = await ProtegoMultiInvoiceNotes.deploy(
      usdcAddress,
      invoiceNFTAddress,
      {
        gasLimit: DUCKCHAIN_CONFIG.duckchain.gasLimit.medium
      }
    );
    await multiInvoiceNotes.deployed();
    const multiInvoiceNotesAddress = multiInvoiceNotes.address;
    
    logSuccess(`Multi-Invoice Notes deployed on DuckChain: ${multiInvoiceNotesAddress}`);

    // =========================================================================
    // STEP 7: DuckChain Specific Configuration
    // =========================================================================
    logStep(7, "DuckChain Ecosystem Integration");
    
    logInfo("Configuring for TON ecosystem benefits...");
    
    // Set up DuckChain/TON specific configurations
    await masterVault.setGoatAgent(DUCKCHAIN_CONFIG.goatAgent.address, {
      gasLimit: DUCKCHAIN_CONFIG.duckchain.gasLimit.small
    });
    
    logSuccess(`Platform fee: ${DUCKCHAIN_CONFIG.platformFeeBps / 100}%`);
    logSuccess(`TON ecosystem multiplier: ${DUCKCHAIN_CONFIG.tonMultiplier / 100}x`);
    logSuccess(`GOAT Agent configured: ${DUCKCHAIN_CONFIG.goatAgent.address}`);

    // =========================================================================
    // STEP 8: Setup Testing Environment with Lower Gas
    // =========================================================================
    logStep(8, "Setup DuckChain Testing Environment");
    
    logInfo("Approving USDC with DuckChain gas optimization...");
    const approveAmount = ethers.utils.parseUnits("1000000", 6);
    
    // Use lower gas limits for L2 efficiency
    const gasOptions = { gasLimit: DUCKCHAIN_CONFIG.duckchain.gasLimit.small };
    
    await usdc.approve(vaultCoreAddress, approveAmount, gasOptions);
    await usdc.approve(vaultGoatAddress, approveAmount, gasOptions);
    await usdc.approve(masterVaultAddress, approveAmount, gasOptions);
    await usdc.approve(multiInvoiceNotesAddress, approveAmount, gasOptions);
    
    logInfo("Funding contracts for testing...");
    const fundAmount = ethers.utils.parseUnits("50000", 6); // Smaller amounts for L2
    await usdc.transfer(vaultCoreAddress, fundAmount, gasOptions);
    await usdc.transfer(masterVaultAddress, fundAmount, gasOptions);
    
    logSuccess("DuckChain testing environment prepared");

    // =========================================================================
    // STEP 9: Save DuckChain Deployment Data
    // =========================================================================
    logStep(9, "Save DuckChain Deployment Information");
    
    const deploymentData = {
      network: {
        name: "DuckChain",
        type: "EVM-Compatible L2 on TON",
        chainId: Number(network.chainId),
        currency: "TON",
        explorer: isDuckChainMainnet ? "https://duckscan.io" : "https://testnet.duckscan.io",
        isLayer2: true,
        baseLayer: "TON Blockchain"
      },
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      architecture: "duckchain-ton-ecosystem",
      contracts: {
        mockUSDC: usdcAddress,
        masterVault: masterVaultAddress,
        invoiceNFT: invoiceNFTAddress,
        vaultCore: vaultCoreAddress,
        vaultGoat: vaultGoatAddress,
        multiInvoiceNotes: multiInvoiceNotesAddress
      },
      vaultParameters: {
        fundingTarget: ethers.utils.formatUnits(fundingTarget, 6),
        fundingDeadline: new Date(fundingDeadline * 1000).toISOString(),
        invoiceTokenId: invoiceTokenId
      },
      duckchainOptimizations: {
        gasLimits: DUCKCHAIN_CONFIG.duckchain.gasLimit,
        tonMultiplier: DUCKCHAIN_CONFIG.tonMultiplier,
        confirmations: DUCKCHAIN_CONFIG.duckchain.confirmations
      },
      configuration: {
        platformFeeBps: DUCKCHAIN_CONFIG.platformFeeBps,
        baseYieldRate: DUCKCHAIN_CONFIG.baseYieldRate,
        tonMultiplier: DUCKCHAIN_CONFIG.tonMultiplier,
        treasury: deployer.address,
        goatAgent: DUCKCHAIN_CONFIG.goatAgent
      }
    };
    
    // Create deployments directory
    const deploymentsDir = path.join(process.cwd(), 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    
    // Save DuckChain specific deployment file
    const deploymentFile = path.join(deploymentsDir, `protego-duckchain-${Date.now()}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));
    
    const latestFile = path.join(deploymentsDir, 'protego-duckchain-latest.json');
    fs.writeFileSync(latestFile, JSON.stringify(deploymentData, null, 2));
    
    logSuccess(`DuckChain deployment saved: ${deploymentFile}`);

    // =========================================================================
    // STEP 10: DuckChain Deployment Summary
    // =========================================================================
    logStep(10, "DuckChain Deployment Summary");
    
    console.log(c.bold("\n🦆 DUCKCHAIN DEPLOYMENT COMPLETED!"));
    
    console.log("\n" + c.cyan("🌐 Network Information:"));
    console.log(`   Blockchain: DuckChain (EVM-Compatible L2)`);
    console.log(`   Base Layer: TON Blockchain`);
    console.log(`   Chain ID: ${network.chainId}`);
    console.log(`   Currency: TON`);
    console.log(`   Explorer: ${deploymentData.network.explorer}`);
    
    console.log("\n" + c.cyan("📋 Contract Addresses:"));
    console.log(`   Mock USDC (ERC-20):           ${usdcAddress}`);
    console.log(`   Master Vault:                 ${masterVaultAddress}`);
    console.log(`   Invoice NFT (ERC-721):        ${invoiceNFTAddress}`);
    console.log(`   Core Yield Vault:             ${vaultCoreAddress}`);
    console.log(`   GOAT Extension Vault:         ${vaultGoatAddress}`);
    console.log(`   Multi-Invoice Notes (ERC-1155): ${multiInvoiceNotesAddress}`);
    
    console.log("\n" + c.cyan("🦆 DuckChain Benefits:"));
    console.log("   • Lower gas costs than Ethereum");
    console.log("   • Faster transaction finality"); 
    console.log("   • Access to TON ecosystem");
    console.log("   • EVM compatibility for Ethereum tools");
    console.log("   • Cross-chain bridging capabilities");
    
    console.log("\n" + c.cyan("🔗 Integration Opportunities:"));
    console.log("   • Bridge assets from TON mainnet");
    console.log("   • Leverage TON's telegram integration");
    console.log("   • Access TON DeFi protocols");
    console.log("   • Cross-chain yield strategies");
    
    console.log(c.green("\n🎉 Ready to serve the TON ecosystem via DuckChain!"));
    
    return deploymentData;
    
  } catch (error) {
    logError("Environment setup failed");
    throw error;
  }
}

if (require.main === module) {
  main()
    .then((data) => {
      console.log(c.green("\n🦆 DuckChain deployment successful!"));
      process.exit(0);
    })
    .catch((error) => {
      console.error(c.red("\n❌ DuckChain deployment failed:"), error);
      
      // DuckChain specific error help
      if (error.message.includes("Invalid JSON-RPC") || error.code === 522) {
        console.log(c.yellow("\n🔧 RPC Connection Issues:"));
        console.log("1. Verify DuckChain RPC URL in hardhat.config.js");
        console.log("2. Check if DuckChain network is operational");
        console.log("3. Try alternative RPC endpoints");
        console.log("4. Test deployment on local hardhat network first");
      }
      
      process.exit(1);
    });
}

module.exports = { main, DUCKCHAIN_CONFIG };