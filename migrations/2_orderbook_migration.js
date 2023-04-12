const Orderbook = artifacts.require("Orderbook");
const Token1 = artifacts.require("Token1");
const Token2 = artifacts.require("Token2");

module.exports = function (deployer, owner) {
  deployer.deploy(Orderbook);
  deployer.deploy(Token1, "Base Token", "BASE", 1000000);
  deployer.deploy(Token2, "Quote Token", "QUOTE", 1000000);
};
