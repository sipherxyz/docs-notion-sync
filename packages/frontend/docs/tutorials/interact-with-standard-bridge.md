---
title: Interact with Standard Bridge
slug: /tutorials/interact-with-standard-bridge
order: 5.9
description: ""
---

# Prerequisites

Before interacting with the Standard Bridge, ensure you have a solid understanding of:

- **Ethereum and Layer 2:** Ethereum fundamentals and Layer 2 scaling, especially Optimistic Rollups.
- **Web3 Development:** Interacting with smart contracts and handling crypto transactions in Javascript/Typescript.
- **Wallet Management:** Understanding crypto wallets, especially browser extensions like MetaMask.
- **Transaction Mechanics:** Gas fees, confirmation times, and how transactions work on Ethereum and Layer 2.

---

# Deposits

This guide will demonstrate how to deposit (bridge) **1 Ether** from **Mainnet** to **Funki**.

## Overview

Here is an end-to-end overview of how to execute a deposit transaction. We will break it down into [Steps](https://viem.sh/op-stack/guides/deposits#steps) below.

```tsx
import { getL2TransactionHashes } from 'viem/op-stack'
import { account, publicClientL1, publicClientL2, walletClientL1 } from './config'
 
// Build parameters for the transaction on the L2.
const args = await publicClientL2.buildDepositTransaction({
  mint: parseEther('1'),
  to: account.address,
})
 
// Execute the deposit transaction on the L1.
const hash = await walletClientL1.depositTransaction(args)
 
// Wait for the L1 transaction to be processed.
const receipt = await publicClientL1.waitForTransactionReceipt({ hash })
 
// Get the L2 transaction hash from the L1 transaction receipt.
const [l2Hash] = getL2TransactionHashes(receipt)
 
// Wait for the L2 transaction to be processed.
const l2Receipt = await publicClientL2.waitForTransactionReceipt({ 
  hash: l2Hash 
})
```

---

## Steps

### **1. Set up Viem Clients**

First, we will set up our Viem Clients for the Mainnet and Funki chains, including the necessary extensions for the OP Stack.

We will place these in a `config.ts` file.

> The example belows how to set up a Client for a **JSON-RPC Account (Browser Extension, WalletConnect,  etc)**
> 

```tsx
// Import Viem modules.
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet, funki } from 'viem/chains'
import { publicActionsL2, walletActionsL1 } from 'viem/op-stack'
 
// Retrieve Account from an EIP-1193 Provider. 
export const [account] = await window.ethereum.request({ 
  method: 'eth_requestAccounts' 
}) 
 
export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http()
})
 
export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum)
}).extend(walletActionsL1())
 
export const publicClientL2 = createPublicClient({
  chain: funki,
  transport: http()
}).extend(publicActionsL2())
```

### **2. Build the Deposit Transaction**

Next, we will build the deposit transaction on the Funki (L2) chain using the Clients that we created in the previous step.

In the example below, we want to deposit **1 Ether** (via `mint`) onto the Funki chain, to ourselves (`account.address`).

> The `mint` value is the value to deposit (mint) on the Funki (L2) chain. It is debited from the account's Mainnet (L1) balance.
You can also use someone else's address as the `to` value if you wanted to.
> 

```tsx
// Import Viem Clients.
import { publicClientL2 } from './config'
 
// Build parameters for the transaction on the L2.
const args = await publicClientL2.buildDepositTransaction({
  mint: parseEther('1')
  to: account.address,
})
```

### **3. Execute the Deposit Transaction**

After that, we will execute the deposit transaction on the Mainnet (L1) chain.

```tsx
// Import Viem Clients.
import { account, publicClientL2, walletClientL1 } from './config'
 
// Build parameters for the transaction on the L2.
const args = await publicClientL2.buildDepositTransaction({
  mint: parseEther('1')
  to: account.address,
})
 
// Execute the deposit transaction on the L1.
const hash = await walletClientL1.depositTransaction(args) 
```

### **4. Wait for Transaction to be Processed**

Once we have broadcast the transaction to the Mainnet (L1) chain, we need to wait for it to be processed on a block so we can extract the transaction receipt. We will need the transaction receipt to extract the transaction on the Funki (L2) chain.

> When the transaction has been processed, the `mint` value (1 Ether) will be debited from the account's Mainnet (L1) balance.
> 

```tsx
// Import Viem Clients.
import { 
  account, 
  publicClientL1, 
  publicClientL2,
  walletClientL1 
} from './config'
 
// Build parameters for the transaction on the L2.
const args = await publicClientL2.buildDepositTransaction({
  mint: parseEther('1')
  to: account.address,
})
 
// Execute the deposit transaction on the L1. 
const hash = await walletClientL1.depositTransaction(args) 
 
// Wait for the L1 transaction to be processed.
const receipt = await publicClientL1.waitForTransactionReceipt({ hash }) 
```

### **5. Compute the L2 Transaction Hash**

Once we have the transaction receipt from the Mainnet (L1) chain, we can extract the Funki (L2) transaction hash from the logs in the transaction receipt.

```tsx
// Import Viem Clients.
import { 
  account, 
  publicClientL1, 
  publicClientL2,
  walletClientL1 
} from './config'
 
// Build parameters for the transaction on the L2.
const args = await publicClientL2.buildDepositTransaction({
  mint: parseEther('1')
  to: account.address,
})
 
// Execute the deposit transaction on the L1. 
const hash = await walletClientL1.depositTransaction(args) 
 
// Wait for the L1 transaction to be processed. 
const receipt = await publicClientL1.waitForTransactionReceipt({ hash }) 
 
// Get the L2 transaction hash from the L1 transaction receipt.
const [l2Hash] = getL2TransactionHashes(receipt) 
```

### **6. Wait for Transaction to be Processed**

Now that we have the Funki (L2) transaction hash, we can wait for the transaction to be processed on the Funki (L2) chain.

Once the `waitForTransactionReceipt` call resolves, the transaction has been processed and you should now be credited with 1 Ether on the Funki (L2) chain 🥳

```tsx
// Import Viem Clients.
import { 
  account, 
  publicClientL1, 
  publicClientL2,
  walletClientL1 
} from './config'
 
// Build parameters for the transaction on the L2.
const args = await publicClientL2.buildDepositTransaction({
  mint: parseEther('1')
  to: account.address,
})
 
// Execute the deposit transaction on the L1. 
const hash = await walletClientL1.depositTransaction(args) 
 
// Wait for the L1 transaction to be processed. 
const receipt = await publicClientL1.waitForTransactionReceipt({ hash }) 
 
// Get the L2 transaction hash from the L1 transaction receipt. 
const [l2Hash] = getL2TransactionHashes(receipt) 
 
// Wait for the L2 transaction to be processed.
const l2Receipt = await publicClientL2.waitForTransactionReceipt({  
  hash: l2Hash  
}) 
```

---

# **Withdrawals**

This guide will demonstrate how to withdraw **1 Ether** from **Funki** to **Mainnet**.

## **Overview**

Withdrawals on Funki involve a three-step process:

1. **Initiating** the Withdrawal Transaction on L2 (Funki)

> Wait up to one hour for the L2 Output containing the transaction to be proposed.
> 
1. **Proving** the Withdrawal Transaction on L1 (Mainnet)

> Wait for the 7-day finalization period
> 
1. **Finalizing** the Withdrawal Transaction on L1 (Mainnet)

> Withdrawal complete!
> 

Below is a complete end-to-end overview of how to execute a withdrawal. Don't worry—we'll break it down into steps later.

```tsx
import { getWithdrawals } from 'viem/op-stack'
import { 
  account, 
  publicClientL1, 
  walletClientL1,
  publicClientL2, 
  walletClientL2 
} from './config'
 
// Build parameters to initiate the withdrawal transaction on the L1.
const args = await publicClientL1.buildInitiateWithdrawal({
  to: account.address,
  value: parseEther('1')
})
 
// Execute the initiate withdrawal transaction on the L2.
const hash = await walletClientL2.initiateWithdrawal(args)
 
// Wait for the initiate withdrawal transaction receipt.
const receipt = await publicClientL2.waitForTransactionReceipt({ hash })
 
// Wait until the withdrawal is ready to prove.
const { output, withdrawal } = await publicClientL1.waitToProve({
  receipt,
  targetChain: walletClientL2.chain
})
 
// Build parameters to prove the withdrawal on the L2.
const proveArgs = await publicClientL2.buildProveWithdrawal({
  output,
  withdrawal,
})
 
// Prove the withdrawal on the L1.
const proveHash = await walletClientL1.proveWithdrawal(proveArgs)
 
// Wait until the prove withdrawal is processed.
const proveReceipt = await publicClientL1.waitForTransactionReceipt({
  hash: proveHash
})
 
// Wait until the withdrawal is ready to finalize.
await publicClientL1.waitToFinalize({
  targetChain: walletClientL2.chain,
  withdrawalHash: withdrawal.withdrawalHash,
})
 
// Finalize the withdrawal.
const finalizeHash = await walletClientL1.finalizeWithdrawal({
  targetChain: walletClientL2.chain,
  withdrawal,
})
 
// Wait until the withdrawal is finalized.
const finalizeReceipt = await publicClientL1.waitForTransactionReceipt({
  hash: finalizeHash
})
```

---

## Steps

### **1. Set up Viem Clients**

First, we will set up our Viem Clients for the Mainnet and Funki chains, including the necessary extensions for the OP Stack.

We will need the following clients:

- `publicClientL1`/`walletClientL1`: Public & Wallet Client for **Mainnet**
- `publicClientL2`/`walletClientL2`: Public & Wallet Client for **Funki**

We will place these in a `config.ts` file.

> The example belows how to set up a Client for a **JSON-RPC Account (Browser Extension, WalletConnect,  etc)**
> 

```tsx
// Import Viem modules.
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { mainnet, funki } from 'viem/chains'
import { publicActionsL1, walletActionsL1, walletActionsL2 } from 'viem/op-stack'
 
// Retrieve Account from an EIP-1193 Provider. 
export const [account] = await window.ethereum.request({ 
  method: 'eth_requestAccounts' 
}) 
 
export const publicClientL1 = createPublicClient({
  chain: mainnet,
  transport: http()
}).extend(publicActionsL1())
 
export const walletClientL1 = createWalletClient({
  account,
  chain: mainnet,
  transport: custom(window.ethereum)
}).extend(walletActionsL1())
 
export const publicClientL2 = createPublicClient({
  chain: funki,
  transport: http()
})
 
export const walletClientL2 = createWalletClient({
  account,
  chain: funki,
  transport: custom(window.ethereum)
}).extend(walletActionsL2())
```

### **2. Initiate Withdrawal**

Next, we will initiate the withdrawal transaction on the L2 by building the parameters on the L1 (1), and then executing the transaction on the L2 (2). We also want to wait for the L2 transaction to be processed on a block (3) before we continue.

In the example below, we are initiating a withdrawal for 1 Ether from the L2 (Funki) to the L1 (Mainnet).

```tsx
import { 
  account, 
  publicClientL1,
  publicClientL2, 
  walletClientL2 
} from './config'
 
// 1. Build parameters to initiate the withdrawal transaction on the L1.
const args = await publicClientL1.buildInitiateWithdrawal({
  to: account.address,
  value: parseEther('1')
})
 
// 2. Execute the initiate withdrawal transaction on the L2.
const hash = await walletClientL2.initiateWithdrawal(args)
 
// 3. Wait for the initiate withdrawal transaction receipt.
const receipt = await publicClientL2.waitForTransactionReceipt({ hash })
```

### **3. Prove Withdrawal**

After the initiate withdrawal transaction has been processed on a block on the L2, we will then need to prove that withdrawal on the L1.

Before a withdrawal transaction can be proved, the transaction needs to be included in an L2 Output proposal. Until then, we will need to wait for the withdrawal transaction to be ready to be proved (1). This usually takes a maximum of one hour.

Once the L2 output has been proposed, we will need to build the parameters for the prove withdrawal transaction on the L2 (2), and then execute the transaction on the L1 (3). We also want to wait for the L1 transaction to be processed on a block (4) before we continue.

```tsx
import { 
  account, 
  publicClientL1,
  publicClientL2, 
  walletClientL1,
  walletClientL2 
} from './config'
 
// (Shortcut) Get receipt from transaction created in Step 1.
const receipt = 
  await publicClientL2.getTransactionReceipt({ hash: '0x...' })
 
// 1. Wait until the withdrawal is ready to prove.
const { output, withdrawal } = await publicClientL1.waitToProve({ 
  receipt, 
  targetChain: walletClientL2.chain 
}) 
 
// 2. Build parameters to prove the withdrawal on the L2.
const args = await publicClientL2.buildProveWithdrawal({ 
  output, 
  withdrawal, 
}) 
 
// 3. Prove the withdrawal on the L1.
const hash = await walletClientL1.proveWithdrawal(args) 
 
// 4. Wait until the prove withdrawal is processed.
const receipt = await publicClientL1.waitForTransactionReceipt({ 
  hash 
}) 
```

### **4. Finalize Withdrawal**

When the withdrawal transaction has been proved, we will then need to finalize that withdrawal on the L1.

Before a withdrawal transaction can be finalized, we will need to wait the finalization period of 7 days (1).

After the finalization period has elapsed, we can finalize the withdrawal (2).

Once the withdrawal has been successfully finalized (3), then the withdrawal is complete! 🥳

```tsx
import { getWithdrawals } from 'viem/op-stack'
import { 
  account, 
  publicClientL1,
  publicClientL2, 
  walletClientL1,
  walletClientL2 
} from './config'
 
// (Shortcut) Get receipt from transaction created in Step 1.
const receipt = 
  await publicClientL2.getTransactionReceipt({ hash: '0x...' })
 
// (Shortcut) Get withdrawals from receipt in Step 3.
const [withdrawal] = getWithdrawals(receipt)
 
// 1. Wait until the withdrawal is ready to finalize.
await publicClientL1.waitToFinalize({ 
  targetChain: walletClientL2.chain, 
  withdrawalHash: withdrawal.withdrawalHash, 
}) 
 
// 2. Finalize the withdrawal.
const hash = await walletClientL1.finalizeWithdrawal({ 
  targetChain: walletClientL2.chain, 
  withdrawal, 
}) 
 
// 3. Wait until the withdrawal is finalized.
const receipt = await publicClientL1.waitForTransactionReceipt({ 
  hash 
}) 
```