---
title: Funki DEX-FAQ
slug: /tools/dexs/funki-dex-faq
order: 6.5.2
description: An FAQ for Funki DEX, detailing its features, trading capabilities, liquidity provision, token swaps, security audits, and guidelines for users.
keywords: [Funki DEX, FAQ, frequently asked questions, decentralized exchange, token swaps, liquidity pools, UniswapV3, cryptocurrency trading, DeFi, smart contracts, security audits, trading fees]
---


## General


### **1. What is FUNKI Swap?**


FUNKI Swap is a new permissionless, open source (GPL), auction-based protocol for trading across AMMs and other liquidity sources. FUNKI Swap is built based on Uniswap protocol.


FUNKI Swap is available on FUNKI for Funkichain (EVM) only and will be expanding to other chains in the future


### **FUNKI DEX can save swappers money in the following ways:**

- Better prices by aggregating liquidity sources
- Swapping without [network costs](https://support.uniswap.org/hc/en-us/articles/8370337377805)
- Protection against [MEV attacks](https://coinmarketcap.com/alexandria/glossary/front-running) (front-running)
- No [network costs](https://support.uniswap.org/hc/en-us/articles/8370337377805) for failed transactions

### **2. Connected Wallets on Funki Swap - Security Measures**


The Wallets connected on FUNKI Swap are self-custody wallets. They gives you full control over your digital assets, but also means you're responsible for safeguarding your recovery phrase, verifying transactions, and protecting yourself from scams. FUNKI cannot reverse transactions or recover funds on your behalf.


We are supporting some wallets: Metamask, Wallet Connect, …


### **Best Practices for Staying Safe**

1. Never share your private keys or recovery phrase with anyone.
2. Double-check all transaction details before signing.
3. Be wary of unsolicited offers or requests involving your crypto.

### **3. Who uses the FUNKI protocol?**


**The FUNKI ecosystem includes three types of users: Liquidity Providers, Traders, and Developers.**

- **Liquidity Providers (LPs)**: People who provide their crypto assets to help with trading.
- **Traders:** People who swap one token for another.
- **Developers**: People who work with FUNKI smart contracts to power new and exciting experiences.

In total, interactions between these classes create a positive feedback loop.  They are the fuel that our digital economies need to define a common language. This common language allows users to pool and trade tokens.


### **a. Liquidity Providers:**


Liquidity providers, or LPs, provide ERC-20 tokens to FUNKI liquidity pools. Large pools generate higher-volume trades with better pricing than smaller pools.


Hence LPs play the very important role of providing liquidity for traders. In return, LPs earn a fee on every trade in the pool, split pro rata across LPs of that pool.


### 


### **Different types of LP:**

- **Passive LPs:** token holders who wish to invest their assets to accumulate trading fees. This can generate passive income.
- **Professional LPs**: focus on market making as their primary strategy. They develop tools and ways of tracking their liquidity positions across different projects.
- **DeFi Pioneers**: explore complex liquidity provision interactions.
	- Examples include incentivized liquidity, liquidity as collateral, and other experimental strategies. The FUNKI protocol is perfect for projects to experiment with these kinds of ideas.
- **Token Projects**: sometimes choose to become LPs to create a liquid market for their token. This allows users a simple way to buy and sell tokens.

### **b. Traders**


There are a several categories of traders in the protocol ecosystem:

- **Speculators**: individuals who use various community tools and products to swap tokens.
- **Arbitrage Bots:** These are our profit seeking bots! They compare prices across different platforms to find any competitive advantage. These bots actually help keep prices fair and equal.
- **dapp Users:** Individuals who buy tokens from the FUNKI protocol. They later trade these tokens in other applications on the Ethereum network.
- **Smart contracts:** execute trades on the protocol by implementing swap functionality. These products include DEX aggregators to custom Solidity scripts.

In all cases, trades are subject to the same flat fee for trading on the protocol. Each is important for increasing the accuracy of prices and incentivizing liquidity.


### **c. Developers**


Developers build apps and services on top of the FUNKI protocol. There are too many to count across the Ethereum ecosystem, but some examples include:

- FUNKI is completely [open-source](https://github.com/Uniswap/). Countless developers have launched their own front-ends to interact with the FUNKI protocol. You can find FUNKI functions in most of the major DeFi dashboard projects. There are also many FUNKI protocol tools built by the community.
- Wallets can integrate swapping and liquidity functionality as a core offering.
- [DEX aggregators](https://www.lcx.com/role-of-dex-aggregators-in-defi/#:~:text=DEX%20aggregators%20are%20financial%20protocols,an%20Ethereum%2Dbased%20DEX%20aggregator.)) pull liquidity from several liquidity protocols. This allows them to offer traders the best available prices. The Uniswap protocol is the biggest single decentralized liquidity source for these projects.
- Smart contract developers can invent new tools and experiment with other various ideas. Examples include projects like [Unisocks](https://unisocks.exchange/) or [Zora](https://zora.co/), but the possibilities are limitless!

Many members of the FUNKI ecosystem take part in more than one of these roles. You can be a Liquidity Provider, Trader, and a Developer all at the same time!


### **4. What are FUNKI Swap’s fees?**

- Liquidity Provider Fee (LP Fee) is set by Liquidity Providers. There are 3 tiers: 
- 0.05%
- 0.3%
- 1%
- Protocol Fee/ Platform Fee

At the moment there are no protocol fees. However, it is possible for a 0.05% fee to be turned on in the future.


### **5. Supported Token List**

- Currently, FUNKI Swap supports ETH, USDT, & SIPHER token only.
- We will support more tokens in the near future

### **6. Unsupported Token and NFT Policy**


### **a. Asset blocking policy**


The FUNKI Protocol is a self-executing, permissionless, decentralized series of smart contracts that cannot be changed by anyone.


FUNKI maintains one of many ways to interact with the Protocol, and as a company based in the United States is subject to certain laws and regulations.


As such, there may be certain circumstances under which Labs blocks access to certain products through our own interfaces.


### **b. Ways that Access can be Restricted on FUNKI Interfaces**


Blocks may be applied in two ways:

- We can block _specific token contracts_ by adding them to the Unsupported Tokens List. If a token contract is blocked:
	- Any user viewing the corresponding token info page should see a message that the token is not supported; and
	- Interactions (including both direct user actions and routing) with any liquidity pool including the blocked token should be disabled.
	- Wallet users may still send and receive unsupported tokens.
- We can also block _individual addresses_. If a user attempts to connect or use a blocked address, all actions that would modify chain state are disabled. This [type of block](https://support.uniswap.org/hc/en-us/articles/8671777747597-Address-Screening-Guide) will generally be applied on the basis of sanctions lists or other third-party screening.

Blocking criteria will be identical across all our products (e.g., web, wallet).


### **c. Criteria for Restricting Access on FUNKI Interfaces**


1. We _will_ block token contracts for four main reasons:

1. Legal and regulatory requirements. An U.S. agency settlement or court judgment against the token’s issuer finds that the tokens/NFTs are regulated financial instruments (e.g., securities or derivatives) when traded in secondary transactions; or otherwise, upon internal legal review, and consultation with counsel; Fraud allegations. A major financial or criminal regulator files fraud allegations against the issuer; Intellectual property claims. A holder of intellectual property serves us with notice of plausible infringement of (i) a copyright (subject to notice and takedown provisions of the DMCA), or (ii) a trademark (not subject to the DMCA and its established counter-notice procedures), or (iii) the publicity rights of a third party (beyond the mere usage of a common name, and again not subject to the DMCA); or Risks to users. We believe there are technical, fraud, or other risks that could significantly affect user safety.
2. We _will_ block individual or smart contract addresses that are subject to U.S. government sanctions or associated with certain types of illegal activity.
3. We _may_ block individual or smart contract addresses for any other reason at our discretion. For example, we might have reason to believe that an address is associated with fraud, theft, or market manipulation, or that a smart contract has unacceptable security vulnerabilities.

### **7. How to initiate an appeal request**


To initiate an appeal for an unsupported asset on FUNKI interface, please follow these steps:

1. Email to **`hello@funkichain.com`** with “Appeal request” in the subject line.
2. Include the name of the asset, contract address, and reason you’re appealing.
3. FUNKI compliance team will acknowledge receipt of the request within xx business day.
4. FUNKI will internally review appeal requests on a case-by-case basis.
<details>
<summary>**Can I change slippage when using FUNKI Swap?**</summary>

![Screenshot_2024-09-06_at_14.17.59.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/a29d0ad0-5c40-46dc-afd9-2ba0cc23a350/a3360061-c189-4218-86d4-ce77005efd37/Screenshot_2024-09-06_at_14.17.59.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45FSPPWI6X%2F20241217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241217T142227Z&X-Amz-Expires=3600&X-Amz-Signature=6aae8f7154586d5307576f8aee8ff9dbf33ea6fb21194e94603f1a361d409aed&X-Amz-SignedHeaders=host&x-id=GetObject)


Slippage can be adjusted for swaps using FUNKI Swap


</details>

<details>
<summary>**How to swap on FUNKI Swap**</summary>

Here’s how to swap tokens on FUNKI Swap:


[steps & screenshots]


</details>

<details>
<summary>**Is there a swap minimum for a FUNKI DEX transaction?**</summary>

No minimum has been set yet.


</details>

<details>
<summary>**Why can my swap not be filled?**</summary>

**A swap might not be filled for the following reasons:**

- An error occurred while submitting the swap
- An error occurred while signing the submission
- A token approval may need to be revoked and approved again

There are no network costs charged when an unfilled or failed swap, so the swap can be submitted again.


</details>

<details>
<summary>**Why did my swap expire?**</summary>

Swaps expire when swap is not filled within the designated time frame.


The deadline for a FUNKI DEX swap to be filled is 1 minute. If no filler fills the swap by then the swap will expire.


There are no network costs charged when an unfilled or failed swap, so the swap can be submitted again.


</details>


### **8. How to add liquidity to FUNKI**


FUNKI allows you to concentrate your liquidity position within a custom price range.


You can create a pair and pool for these supported tokens: ETH, WETH, USDT, USDC, SIPHER


### **9. How to remove liquidity from FUNKI**


When removing liquidity from FUNKI, you will remove your liquidity position and collect earned fees.


Or, you only collect liquidity provider fees earned, without removing liquidity.


### **10. How to collect fees from a liquidity pool on FUNKI**


FUNKI allows fees earned to be collected from the liquidity pool without removing liquidity.


![Screenshot_2024-09-06_at_16.39.36.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/a29d0ad0-5c40-46dc-afd9-2ba0cc23a350/e2f514af-9134-4969-bcd4-9f0e1af1f284/Screenshot_2024-09-06_at_16.39.36.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45FSPPWI6X%2F20241217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241217T142225Z&X-Amz-Expires=3600&X-Amz-Signature=f339c67d271270268afbf826e35460eb37055a225aed097b39d50d04a97005d2&X-Amz-SignedHeaders=host&x-id=GetObject)


![Screenshot_2024-09-06_at_16.39.57.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/a29d0ad0-5c40-46dc-afd9-2ba0cc23a350/7257da7b-b963-47bf-a7a4-79e91335e847/Screenshot_2024-09-06_at_16.39.57.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45FSPPWI6X%2F20241217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241217T142225Z&X-Amz-Expires=3600&X-Amz-Signature=2cad7863789f8bb0ff80b3f1d85674a603367421bba00b48867d94aff236e461&X-Amz-SignedHeaders=host&x-id=GetObject)

