require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
            optimizerSteps: "dhfoDgvulfnTUtnIf"
          }
        }
      },
      viaIR: true, // Enable IR-based compilation for better optimization
    },
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
  // Gas reporter configuration
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    gasPrice: 0.1, // Duck's low gas costs
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: "Duck",
    gasPriceApi: "https://api.duckChain.io/gas-price", // Custom for Duck if available
  },
  
  // Mocha test configuration  
  mocha: {
    timeout: 120000, // 2 minutes for comprehensive tests
    reporter: "spec",
    slow: 5000,
  },
  
  // Contract size limits
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  
  // Path configuration
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./deploy",
    deployments: "./deployments",
  },
  
  // External contract dependencies
  external: {
    contracts: [
      {
        artifacts: "node_modules/@openzeppelin/contracts",
      },
    ],
  },
  
  // Compiler warnings suppression
  warnings: {
    "*": {
      "contracts/mocks/**/*": "off",
      "default": "error"
    }
  }
};