# Orderbook Smart Contract: Creating an ERC20-Compatible DEX on Ethereum

This repo contains details building an ERC20-compatible orderbook smart contract on Ethereum, including fundamental concepts, writing, testing, and deployment. There is a [blog post](https://nzouat.com/orderbook-smart-contract-creating-an-erc20-compatible-dex-on-ethereum/) attached to this repo that explain how it works in details.

## CORE CONCEPTS OF AN ORDERBOOK

As we delve into the intricacies of building an orderbook smart contract compatible with ERC20 tokens, it’s important to understand the fundamental principles and components of an orderbook. This knowledge will provide the foundation for our smart contract development.

### A. What is an Orderbook?

An orderbook is a mechanism used by exchanges to list and match buy and sell orders for assets. In the context of a decentralized exchange (DEX), the orderbook smart contract serves as the engine that records, organizes, and matches orders, ultimately executing trades in a transparent and trustless manner.

### B. Understanding Buy and Sell Orders

- Buy Orders (Bid Orders): These represent the intent of traders to purchase a certain quantity of an asset at a specified price. Also known as bid orders and placed using ERC20 tokens representing the quote asset (e.g., stablecoins).
- Sell Orders (Ask Orders): These represent the intent of traders to sell a certain quantity of an asset at a specified price. Also known as ask orders and involve selling ERC20 tokens representing the base asset.

### C. Matching and Executing Trades

- Order Matching: The orderbook smart contract matches compatible buy and sell orders. A match occurs when a buy order’s price is greater than or equal to a sell order’s price.
- Trade Execution: When a match is found, the orderbook smart contract facilitates the trade execution by transferring the appropriate quantities of ERC20 tokens between the buyer and the seller. This process involves updating the orderbook and handling the allowances of ERC20 tokens.

### D. Maintaining a Sorted Orderbook

- Sorting Orders: To optimize order matching, the orderbook smart contract typically maintains orders in a sorted order, with buy orders sorted by price in descending order and sell orders sorted by price in ascending order.
- Inserting and Removing Orders: The smart contract should handle the insertion and removal of orders efficiently while preserving the sorted order of the orderbook.
