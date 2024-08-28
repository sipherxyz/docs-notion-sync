---
title: Deploying a smart contract using Foundry
slug: tutorials/deploy-sm-using-foundry
description: ""
---

This article provides an overview of the Funki development toolchain and demonstrates how to deploy a contract to the **FUNKI** network.

 [Foundry](https://book.getfoundry.sh/) is a powerful suite of tools for developing, testing, and debugging smart contracts. It consists of four key components:

- `forge`: Foundry's main workhorse—used for developing, testing, compiling, and deploying smart contracts
- `cast`: A command-line tool for performing Ethereum RPC calls (e.g., interacting with contracts, sending transactions, and retrieving on-chain data)
- `anvil`: A local testnet node for testing contract behavior from a frontend or over RPC
- `chisel`: A Solidity [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) for experimenting with Solidity snippets on a local or forked network

Funki offers lightning-fast feedback loops (thanks to its Rust-based implementation) and minimizes context switching—you'll write your contracts, tests, and deployment scripts all in Solidity!

> For production or mainnet deployments, the process remains largely the same. The key difference is configuring `FunkiMainnet` as your network instead of `FunkiSepolia`. For network details, refer to the [Funki chain info](https://docs.funkichain.com/docs/network-information).
>

---

## Objectives

By the end of this tutorial, you'll be able to:

- Set up Foundry for Funki development
- Create an NFT smart contract compatible with Funki
- Compile a smart contract for Funki using `forge`
- Deploy a smart contract to Funki using `forge`
- Interact with a deployed smart contract on Funki using `cast`

---

## Prerequisites

### Foundry

This tutorial requires Foundry. To install it:

- Run this command in your terminal: `curl -L https://foundry.paradigm.xyz | bash`
- Then run `foundryup` to install the latest (nightly) build of Foundry

For more details, consult the Foundry Book's [installation guide](https://book.getfoundry.sh/getting-started/installation).

### Web3 Wallet

To deploy a smart contract, you'll need a web3 wallet. Create one by installing a wallet browser extension:

- Install [MetaMask Wallet](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=metamask.io&pli=1)
- Install [Coinbase Wallet](https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad?hl=en)

### Wallet Funds

Deploying contracts requires ETH for gas fees. For this tutorial, you'll deploy to the Funnki testnet. Fund your wallet with Funki Sepolia ETH using a faucet listed on the Funki [Network Faucets](https://funkichain.com/portfolio/tokens?modal=claim-faucet) page.

---

## Creating a Project

Before deploying smart contracts to Funki, set up your development environment by creating a Foundry project.

To create a new Foundry project, first create a directory:

```bash
mkdir myproject
```

Then run:

```bash
cd myproject
forge init
```

This creates a Foundry project with the following basic layout:

```bash
.
├── foundry.toml
├── script
│   └── Counter.s.sol
├── src
│   └── Counter.sol
└── test
    └── Counter.t.sol
```

---

## Compiling the Smart Contract

Here's a simple NFT (non-fungible token) smart contract that conforms to the [ERC-721](https://eips.ethereum.org/EIPS/eip-721) standard, written in Solidity:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    uint256 public currentTokenId;

    constructor() ERC721("NFT Name", "NFT") {}

    function mint(address recipient) public payable returns (uint256) {
        uint256 newItemId = ++currentTokenId;
        _safeMint(recipient, newItemId);
        return newItemId;
    }
}
```

This Solidity code defines an `NFT` smart contract using the `ERC721` interface from the [OpenZeppelin Contracts library](https://docs.openzeppelin.com/contracts/5.x/). OpenZeppelin offers battle-tested smart contract implementations that comply with official ERC standards.

To incorporate the OpenZeppelin Contracts library into your project, execute:

```bash
forge install openzeppelin/openzeppelin-contracts
```

In your project, replace the generated `src/Counter.sol` contract with the above code in a new file called `contracts/NFT.sol`. (You can also remove `test/Counter.t.sol` and `script/Counter.s.sol`, but be sure to add your own tests soon!)

To compile our basic NFT contract using Foundry, run:

```bash
forge build
```

---

## Configuring Foundry with Funki

Next, you'll configure your Foundry project for deploying smart contracts to the Funki network. This two-step process involves storing your private key in an encrypted keystore and adding Funki as a network.

### Storing your private key

To import your private key into Foundry's secure keystore, use the following command. You'll be prompted to enter your private key and create a password for transaction signing:

```bash
cast wallet import deployer --interactive
```

> To retrieve your private key from Wallet, refer to the [Coinbase Wallet documentation](https://docs.cloud.coinbase.com/wallet-sdk/docs/developer-settings#show-private-key) or [Metamask Wallet documentation](https://docs.metamask.io/). **Never commit your private key to a public repository**.
> 

Verify that the 'deployer' account is set up in Foundry by running:

```bash
cast wallet list
```

### Adding Funki as a network

To verify a contract with FunkiScan, you'll need an API key. Obtain your FunkiScan API key [here](https://funki.superscan.network/) after creating an account.

Create a `.env` file in your project's home directory to add the Funki network and your FunkiScan API key:

```
FUNKI_MAINNET_RPC="https://rpc-mainnet.funkichain.com"
FUNKI_TESTNET_RPC="https://funki-testnet.alt.technology"
ETHERSCAN_API_KEY="<YOUR API KEY>"
```

Although you're using FunkiScan as your block explorer, Foundry requires the API key to be defined as `ETHERSCAN_API_KEY`.

### Loading environment variables

After creating the `.env` file, load the environment variables in your current command line session with:

```bash
source .env
```

---

## Deploying the Smart Contract

With your contract compiled and environment configured, you're ready to deploy to the Funki testnet!

You'll use the `forge create` command—a straightforward way to deploy a single contract. For more complex projects, consider exploring [`forge script`](https://book.getfoundry.sh/tutorials/solidity-scripting), which enables scripting on-chain transactions and deploying intricate smart contract systems.

Before proceeding, ensure you have testnet ETH in your wallet. If not, revisit the [prerequisites](#prerequisites) to avoid deployment hiccups.

To deploy the contract to Funki Sepolia Testnet, execute the following command and enter the password you set when importing your private key:

```bash
forge create ./src/NFT.sol:NFT --rpc-url $FUNKI_TESTNET_RPC --account deployer
```

Once deployed, view the contract's status using a [block explorer](https://docs-funki.sipher.gg/docs/tools/block-explorers/). Search for the address returned by your deploy script. If you've deployed an exact copy of the NFT contract above, it will be pre-verified, allowing you to interact with it via the web interface.

For mainnet deployment, modify the command:

```bash
forge create ./src/NFT.sol:NFT --rpc-url $FUNKI_MAINNET_RPC --account deployer
```

Remember, new or modified contracts require verification, regardless of the network.

---

## Verifying the Smart Contract

In web3, contract verification is crucial. It allows users and developers to inspect the source code and confirm it matches the deployed bytecode on the blockchain.

Verification is also necessary for others to interact with your contract via the block explorer. While the above contract is pre-verified, let's walk through the verification process on Funki testnet.

> As of this writing, FunkiScan utilizes the RouteScan API. Their free tier doesn't require an API key and offers **2 requests per second (rps)** with **a daily limit of 10,000 calls**. For more details, visit the [RouterScan API Plans](https://routescan.io/documentation#api-plans) page.
> 

To verify, grab the deployed address and run:

```bash
forge verify-contract &lt;DEPLOYED_ADDRESS&gt; ./src/NFT.sol:NFT --chain 33979 --watch
```

Confirm verification by searching for your contract on [FunkiScan](https://funkiscan.io/).

> Note: You cannot re-verify a contract that has already been verified with identical code. Attempting to do so will result in an error.
>

---

## Interacting with the Smart Contract

After verifying your contract on [FunkiScan](https://funkiscan.io/), you can interact with it through the "Read Contract" and "Write Contract" sections under the "Contract" tab. To use the "Write Contract" feature, connect your wallet by clicking the "Connect to Web3" button. Be aware that you might need to click "Connect" twice to establish a successful connection.

To practice using Foundry's `cast` command-line tool, you'll perform a read operation without publishing a transaction, then sign and publish a write transaction.

### Performing a call

`cast`, a core component of the Foundry toolkit, enables interaction with contracts, transaction sending, and on-chain data retrieval via Ethereum RPC calls. Let's begin by executing a read-only call from your account.

Enter this command in your terminal:

```bash
cast call &lt;DEPLOYED_ADDRESS&gt; --rpc-url $FUNKI_TESTNET_RPC "balanceOf(address)" &lt;YOUR_ADDRESS_HERE&gt;
```

You should receive `0x0000000000000000000000000000000000000000000000000000000000000000` in response, which equals `0` in hexadecimal. This makes sense—you've deployed the NFT contract, but no NFTs have been minted yet, so your account balance is zero.

### Signing and publishing a transaction

Now, let's sign and publish a transaction by calling the `mint(address)` function on your newly deployed NFT contract.

Enter the following command in your terminal:

```bash
cast send &lt;DEPLOYED_ADDRESS&gt; --rpc-url=$FUNKI_TESTNET_RPC "mint(address)" &lt;YOUR_ADDRESS_HERE&gt; --account deployer
```

Note that this `cast send` command requires your private key, unlike `cast call`. The latter is for view-only functions and doesn't need signing.

Upon success, Foundry will display transaction details, including the `blockNumber`, `gasUsed`, and `transactionHash`.

To verify that you've minted an NFT, run the initial `cast call` command again. Your balance should now show an increase from 0 to 1:

```bash
cast call &lt;DEPLOYED_ADDRESS&gt; --rpc-url $FUNKI_TESTNET_RPC "balanceOf(address)" &lt;YOUR_ADDRESS_HERE&gt;
```

The response should be `0x0000000000000000000000000000000000000000000000000000000000000001` (`1` in hex). Congratulations! You've successfully deployed a contract and minted an NFT using Foundry.

---

## Interact with the Contract on FunkiScan[](#interact-with-the-contract)

You can now interact with your contract using [FunkiChain](https://funki-testnet.alt.technology). Click the *Contract* tab. If your contract is verified, you'll see the contract's source code and all its functions under the `Read Contract` and `Write Contract` buttons. Note that only write functions require an on-chain transaction.

To interact with write functions, you need to sign in to [FunkiChain](https://funki-testnet.alt.technology) with your wallet. Currently, you can choose from any of the supported wallet providers that appear.

![image.png](/img/connect-wallet.png)

Once connected, you're all set to interact with any write function of the contract. Make sure your input is correct and double-check the transaction details before confirming any transaction.

---

## Conclusion

Congratulations! You've accomplished a great deal. You've mastered project setup, deployment to Funki, and smart contract interaction using Foundry. This process applies to real networks too, albeit at a higher cost. Remember, thorough testing of your contracts is crucial to minimize the risk of bugs that could affect users before deployment.

For comprehensive Foundry resources, dive into the [Foundry book](https://book.getfoundry.sh/). Need community support? Join the official Telegram [dev chat](https://t.me/foundry_rs) or [support chat](https://t.me/foundry_support).