require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Duck Chain Mainnet
    duckchain: {
      url: "https://rpc.duckchain.io", // Primary RPC
      chainId: 5545,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gas: "auto",
      gasPrice: "auto",
      timeout: 60000,
      // Duck Chain specific settings
      blockGasLimit: 30000000, // Adjust based on network capacity
      confirmations: 2,
      timeoutBlocks: 50
    },
    
    // Duck Chain Testnet  
    duckchain_testnet: {
      url: "https://testnet-rpc.duckchain.io", // Testnet RPC
      chainId: 202105,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gas: "auto", 
      gasPrice: "auto",
      timeout: 60000,
      blockGasLimit: 30000000,
      confirmations: 1, // Faster for testnet
      timeoutBlocks: 25
    },

    // Alternative RPC endpoints (backup)
    duckchain_alt: {
      url: "https://duck-chain-rpc.com", // Alternative RPC if available
      chainId: 5545,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    
    // Local development (if you're running a Duck Chain node locally)
    duckchain_local: {
      url: "http://127.0.0.1:8545",
      chainId: 5545,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  
  // Etherscan verification (if Duck Chain has block explorer verification)
  etherscan: {
    apiKey: {
      duckchain: process.env.DUCKCHAIN_API_KEY || "your-api-key-here",
      duckchain_testnet: process.env.DUCKCHAIN_TESTNET_API_KEY || "your-api-key-here"
    },
    customChains: [
      {
        network: "duckchain",
        chainId: 5545,
        urls: {
          apiURL: "https://api.duckscan.io/api", // Adjust if different
          browserURL: "https://duckscan.io" // Adjust if different
        }
      },
      {
        network: "duckchain_testnet", 
        chainId: 202105,
        urls: {
          apiURL: "https://testnet-api.duckscan.io/api",
          browserURL: "https://testnet.duckscan.io"
        }
      }
    ]
  },

  // Gas reporter configuration for Duck Chain
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "TON", // Duck Chain uses TON as native currency
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  }
};

// Duck Chain specific deployment configuration (no ethers here)
const DUCK_CHAIN_CONFIG = {
  // Gas settings optimized for Duck Chain (use string values in config)
  gasSettings: {
    maxFeePerGas: "20000000000", // 20 gwei in wei
    maxPriorityFeePerGas: "2000000000", // 2 gwei in wei
    gasLimit: 300000 // Conservative default
  },
  
  // Duck Chain native token info
  nativeToken: {
    name: "TON",
    symbol: "TON", 
    decimals: 18
  },
  
  // Block explorer
  explorer: {
    mainnet: "https://duckscan.io",
    testnet: "https://testnet.duckscan.io"
  },
  
  // Recommended deployment order for Duck Chain
  deploymentSteps: [
    "MockERC20", 
    "ProtegoMasterVault",
    "ProtegoYieldVaultCore", 
    "ProtegoYieldVaultGoat",
    "ProtegoMultiInvoiceNotes"
  ]
};

module.exports.DUCK_CHAIN_CONFIG = DUCK_CHAIN_CONFIG;