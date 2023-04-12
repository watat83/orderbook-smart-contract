const Orderbook = artifacts.require("Orderbook");
const Token1 = artifacts.require("Token1");
const Token2 = artifacts.require("Token2");

contract("Orderbook", async (accounts) => {
  let orderbook;
  let baseToken;
  let quoteToken;
  const owner = accounts[0];
  const trader1 = accounts[1];
  const trader2 = accounts[2];

  beforeEach(async () => {
    // Deploy the Orderbook smart contract
    orderbook = await Orderbook.deployed();

    // Deploy mock ERC20 tokens for testing
    baseToken = await Token1.deployed();
    quoteToken = await Token2.deployed();

    let bal = await quoteToken.balanceOf(owner);

    await baseToken.transfer(trader1, 1000, {
      from: owner,
    });
    await quoteToken.transfer(trader1, 1000);
    await baseToken.transfer(trader2, 1000);
    await quoteToken.transfer(trader2, 1000);
  });

  // Test case: Placing a buy order
  it("should place a buy order and match with existing sell orders", async () => {
    // Approve the Orderbook to spend quote tokens for trader1
    await quoteToken.approve(orderbook.address, 100, {
      from: trader1,
    });

    // Place a sell order from trader2
    await baseToken.approve(orderbook.address, 10, {
      from: trader2,
    });

    await orderbook.placeSellOrder(
      10,
      10,
      baseToken.address,
      quoteToken.address,
      { from: trader2 }
    );

    // Place a buy order from trader1
    const result = await orderbook.placeBuyOrder(
      10,
      10,
      baseToken.address,
      quoteToken.address,
      { from: trader1 }
    );

    // Verify that the buy order is matched and executed
    assert.equal(result.logs[0].event, "TradeExecuted");
    assert.equal(result.logs[0].args.buyer, trader1);
    assert.equal(result.logs[0].args.seller, trader2);
  });

  // Test case: Placing a sell order

  it("should place a sell order and match with existing buy orders", async () => {
    // Approve the Orderbook to spend base tokens for trader1
    await baseToken.approve(orderbook.address, 10, {
      from: trader1,
    });

    // Place a buy order from trader2
    await quoteToken.approve(orderbook.address, 100, {
      from: trader2,
    });

    await orderbook.placeBuyOrder(
      10,
      10,
      baseToken.address,
      quoteToken.address,
      { from: trader2 }
    );

    // Place a sell order from trader1
    const result = await orderbook.placeSellOrder(
      10,
      10,
      baseToken.address,
      quoteToken.address,
      { from: trader1 }
    );

    // Verify that the sell order is matched and executed
    assert.equal(result.logs[0].event, "TradeExecuted");
    assert.equal(result.logs[0].args.buyer, trader2);
    assert.equal(result.logs[0].args.seller, trader1);
  });

  // Test case: Handling partial order fulfillment

  it("should handle partial order fulfillment", async () => {
    // Approve the Orderbook to spend tokens for traders

    await quoteToken.approve(orderbook.address, 200, {
      from: trader1,
    });

    await baseToken.approve(orderbook.address, 200, {
      from: trader2,
    });

    // Place a buy order for 10 base tokens from trader1
    await orderbook.placeBuyOrder(
      15,
      10,
      baseToken.address,
      quoteToken.address,
      { from: trader1 }
    );

    // Place a sell order for 5 base tokens from trader2
    const result = await orderbook.placeSellOrder(
      10,
      5,
      baseToken.address,
      quoteToken.address,
      { from: trader2 }
    );

    // Verify that the sell order is matched and partially fulfills the buy order
    assert.equal(result.logs[0].event, "TradeExecuted");
    assert.equal(result.logs[0].args.buyer, trader1);
    assert.equal(result.logs[0].args.seller, trader2);
    assert.equal(result.logs[0].args.quantity, 5);
  });

  // Test case: Cancelling an order

  it("should allow a trader to cancel an order", async () => {
    // Approve the Orderbook to spend quote tokens for trader1
    await quoteToken.approve(orderbook.address, 100, {
      from: trader1,
    });

    // Place a buy order from trader1
    await orderbook.placeBuyOrder(
      10,
      10,
      baseToken.address,
      quoteToken.address,
      { from: trader1 }
    );

    // Cancel the buy order
    const result = await orderbook.cancelOrder(0, true, { from: trader1 });

    // Verify that the order is cancelled
    assert.equal(result.logs[0].event, "OrderCanceled");
    assert.equal(result.logs[0].args.orderId, 0);
    assert.equal(result.logs[0].args.isBuyOrder, true);
  });
});
