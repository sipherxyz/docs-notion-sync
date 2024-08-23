---
title: Verify a Smart Contract on FunkiScan
slug: /tutorials/verify-sm-on-funkichain
description: ""
---

[FunkiScan](https://funkiscan.io/) is a block explorer tailored for Funki Mainnet, offering developers a platform to interact with and verify smart contracts deployed on the network. Smart contract verification is essential for ensuring the transparency and security of on-chain applications, allowing others to review and validate the source code of deployed contracts. This tutorial will guide you through popular methods to verify a contract, as several approaches are available.

[FunkiScan](https://funkiscan.io/) uses the [RouterScan API](https://routescan.io/documentation/api-swagger) for contract verification. Currently, no API key is required, and your requests fall under their free plan.

- As of writing these docs, the RouteScan API free tier allows you to use the API without an API key, offering up to **2 requests per second (rps)** and **a daily limit of 10,000 calls**. Read more at [RouterScan API Plans](https://routescan.io/documentation#api-plans)
- To verify a contract on Funki Testnet, simply switch the chain information to [Funki Testnet](https://docs.funkichain.com/docs/network-information). Currently, Funki Testnet is an L2 of Sepolia Testnet, and its explorer is publicly available at [Funki Testnet Explorer](https://sepolia-sandbox.funkichain.com/)

## Objectives

By the end of this tutorial, you should be able to:
- Verify your deployed contract with popular Frameworks and toolkits.
- Verify contract directly on [FunkiScan](https://funkiscan.io/).

---

## Prerequisites

**Familiarity with smart contract development and the Solidity programming language**
Solidity is the primary language for writing smart contracts on Ethereum and Ethereum-compatible blockchains like Funki. You should be comfortable writing, compiling, and deploying basic smart contracts using Solidity.
**Basic understanding of popular frameworks and toolkits for Ethereum development**
Frameworks and toolkits streamline the process of deploying, testing, and interacting with smart contracts. You should be familiar with popular smart contract development tools like Hardhat, Foundry

---

## Hardhat verification
[**hardhat-verify**](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify) is a Hardhat plugin that simplifies the smart contract verification process on Etherscan. Thanks to the Etherscan Compatible Verify Contract API, you can also use this tool to verify your smart contract on [FunkiScan](https://funkiscan.io/).

Here's an example of a hardhat.config.ts file:
```jsx
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-verify";

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: {
      funkiscan: "funkiscan", // apiKey is not required, just set a placeholder
    },
    customChains: [
      {
        network: "funki",
        chainId: 33979,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/mainnet/evm/33979/etherscan",
          browserURL: "https://funkiscan.io"
        }
      }
    ]
  },
  networks: {
    funki: {
      url: 'https://rpc-mainnet.funkichain.com',
      accounts: [process.env.PRIVATE_KEY]
    },
  },
};

export default config;
```
**Deploy**
```jsx
npx hardhat run scripts/deploy.ts --network funki
```
**Verify**
```jsx
export PRIVATE_KEY=...
npx hardhat verify --network funki 0x...
```

---

## Foundry verification
Foundry allows you to verify contracts either during deployment or as a separate step. Be sure to include the `--verifier-url` option in your deploy or verify script.

To verify at deployment time:

```jsx
forge script scripts/Deploy.s.sol
--broadcast --rpc-url [NETWORK_RPC_URL]
--verifier-url 'https://api.routescan.io/v2/network/mainnet/evm/33979/etherscan'
--etherscan-api-key "verifyContract"
```

To verify a contract that has already been deployed:
```jsx
forge verify-contract [contract-address] [src/path/ContractPath.sol:ContractName]
--verifier-url 'https://api.routescan.io/v2/network/mainnet/evm/33979/etherscan'
--etherscan-api-key "verifyContract"
--num-of-optimizations 200
--compiler-version [solc compiler version]
--constructor-args $(cast abi-encode "constructor(address param1, uint256 param2,...)" param1 param2 ...)

```

---

## **FunkiScan verify contract with files**

You can verify contracts using the [FunkiScan verification tool](https://funkiscan.io/verifycontract). This method is particularly useful if you've deployed your contract with Remix IDE and need to verify it.

- Step 1: Enter your deployed contract's address.
- Step 2: Choose your programming language.
- Step 3: Provide the compiler information and upload your file(s). Make sure this information exactly matches what you used when compiling your contract for deployment. You can upload either multiple files or a single flattened file.
- Step 4: Click "Verify Contract" and wait for the result.

![image.png](/img/verify-contract-with-file.png)

---

## Conclusion

Congratulations! You've now mastered the art of deploying smart contracts to the blockchain. While you've only deployed to a test network so far, the process for real networks is identical—just remember, it comes with a heftier price tag!
