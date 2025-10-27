
export const TokenFactoryABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "TokenCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "iconCid_",
        "type": "string"
      },
      {
        "internalType": "uint64",
        "name": "maxSupply_",
        "type": "uint64"
      },
      {
        "internalType": "uint16",
        "name": "creatorReserveBps_",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "publicMintBps_",
        "type": "uint16"
      },
      {
        "internalType": "uint64",
        "name": "perMintAmount_",
        "type": "uint64"
      },
      {
        "internalType": "uint32",
        "name": "perWalletMintLimit_",
        "type": "uint32"
      },
      {
        "internalType": "bool",
        "name": "isTotalSupplyPublic_",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "renounceOnCreation_",
        "type": "bool"
      }
    ],
    "name": "createToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "idx",
        "type": "uint256"
      }
    ],
    "name": "getTokenInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "iconCid",
            "type": "string"
          },
          {
            "internalType": "uint64",
            "name": "maxSupply",
            "type": "uint64"
          },
          {
            "internalType": "uint16",
            "name": "creatorReserveBps",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "publicMintBps",
            "type": "uint16"
          },
          {
            "internalType": "uint64",
            "name": "perMintAmount",
            "type": "uint64"
          },
          {
            "internalType": "uint32",
            "name": "perWalletMintLimit",
            "type": "uint32"
          },
          {
            "internalType": "uint64",
            "name": "publicAllocation",
            "type": "uint64"
          }
        ],
        "internalType": "struct TokenFactory.TokenInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokensCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tokens",
    "outputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "iconCid",
        "type": "string"
      },
      {
        "internalType": "uint64",
        "name": "maxSupply",
        "type": "uint64"
      },
      {
        "internalType": "uint16",
        "name": "creatorReserveBps",
        "type": "uint16"
      },
      {
        "internalType": "uint16",
        "name": "publicMintBps",
        "type": "uint16"
      },
      {
        "internalType": "uint64",
        "name": "perMintAmount",
        "type": "uint64"
      },
      {
        "internalType": "uint32",
        "name": "perWalletMintLimit",
        "type": "uint32"
      },
      {
        "internalType": "uint64",
        "name": "publicAllocation",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
