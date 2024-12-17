---
title: Simple Fungible Tokens
slug: /tutorials/simple-fungible-tokens
order: 5.8
description: ""
---

The Token contract is designed for creating a digital currency that complies with the [ERC20](https://eips.ethereum.org/EIPS/eip-20) standard. These tokens can be bought and traded on exchanges, used to purchase NFTs in marketplaces, and more.

## Objectives

By the end of this tutorial, you'll learn how to:

- Understand the fundamental concepts of ERC-20 tokens
- Create your own ERC-20 tokens using code

---

## Prerequisites

### ERC-20 Tokens

This tutorial assumes you can write, test, and deploy [ERC-20](https://docs.openzeppelin.com/contracts/4.x/erc20) tokens using Solidity. If you need to refresh these skills, explore some introductory resources first.

## What is the ERC-20 token standard?

**The ERC-20 token standard ensures all tokens have identical properties. It guarantees that tokens are fungible (each token is exactly equal to any other) and that no tokens possess special properties or rights.**

For a token to adhere to the ERC-20 standard, it must implement these API methods and events:

- `totalSupply`: Defines the total token supply and halts new token creation when the limit is reached.
- `balanceOf`: Returns the number of tokens in a given wallet address.
- `transfer`: Moves a specified amount of tokens from the total supply to a user.
- `transferFrom`: Transfers ERC-20 tokens between users.
- `approve`: Verifies if a smart contract can allocate a certain amount of tokens to a user, considering the total supply.
- `allowance`: Checks if a user has sufficient balance to send tokens to another user.

*ERC-20 tokens are fungible (interchangeable) due to their identical value and properties. Other token standards include non-fungible and semi-fungible types, such as [ERC-721 and ERC-1155 tokens](https://www.alchemy.com/blog/comparing-erc-721-to-erc-1155).*

## Write ERC-20 Token Smart Contract

Here’s how to write the token contract for your ERC-20 token using Solidity

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";  // OpenZeppelin package contains implementation of the ERC 20 standard, which our NFT smart contract will inherit

contract FunkiToken is ERC20 {
    uint constant _initial_supply = 100 * (10**18);  // setting variable for how many of your own tokens are initially put into your wallet, feel free to edit the first number but make sure to leave the second number because we want to make sure our supply has 18 decimals

    /* ERC 20 constructor takes in 2 strings, feel free to change the first string to the name of your token name, and the second string to the corresponding symbol for your custom token name */
    constructor() ERC20("FunkiToken", "FUN") public {
        _mint(msg.sender, _initial_supply);
    }
}
```

The token symbol you choose (in our case "FUN") can be any length. However, be aware that some user interfaces may display longer symbols differently.

You can adjust the initial supply by changing the value 100 to your desired number of tokens. We chose 100 because FunkiTokens are rare! Feel free to use any number you prefer—just ensure you keep the (10**18) part, as it maintains 18 decimal places for your token supply.

For demonstration purposes, this token will be minted entirely and given to the deployer. In practice, you can separate the token minting function and add conditions based on your project's specific requirements.

For example, here's a mint function restricted to users with the MINTER_ROLE, where the recipient can't be the contract itself:

```solidity
function mint(address _to, uint256 _amount) onlyHasRole(MINTER_ROLE) override external {
    require(_to != address(this), "unable to mint tokens to itself");
    _mint(_to, _amount);
}
```

> To implement access control modifiers like in this example, you can refer to [OpenZeppelin's AccessControl](https://docs.openzeppelin.com/contracts/2.x/access-control) contract implementation.
> 

## Deploy Contract

To deploy the contract, you can refer to our tutorials that suit your preferred tech stack:

- Deploying a smart contract using Foundry
- Deploying a smart contract using Hardhat
- Deploying a smart contract using Remix

## Conclusion

Thanks to robust libraries like OpenZeppelin, creating and launching fungible ERC-20 tokens has become remarkably simple. These tools streamline complex token functionalities, freeing developers to focus on their projects' unique aspects. Even those with limited blockchain experience can now efficiently create secure, compliant ERC-20 tokens. This accessibility opens up a world of possibilities for digital asset creation and management.