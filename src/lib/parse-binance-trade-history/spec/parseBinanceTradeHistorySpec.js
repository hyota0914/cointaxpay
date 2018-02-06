parser = require('../index.js').parseBinanceTradeHistory;
describe("Parse Binance Trade History", function() {
  it("parses buy trade data", function() {
    const history = `Date	Market	Type	Price	Amount	Total	Fee	Fee Coin
      2018-01-22 12:42:32	LSKBTC	BUY	0.0019488	104.38	0.203415744	0.10438	LSK`;
    const ret = parser(history);
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual({
      tradeDate: new Date("2018-01-22 12:42:32"),
      side: "B",
      price: 0.0019488,
      counterCcy: 'BTC',
      baseCcy: 'LSK',
      amount: 104.38,
      feeCcy: 'LSK',
      fee: 0.10438,
      total: 0.203415744,
      ex: 'Binance',
    });
  });

  it("parses sell trade data", function() {
    const history = `Date	Market	Type	Price	Amount	Total	Fee	Fee Coin
      2018-01-22 12:39:44	XRPBTC	SELL	0.00011582	670	0.0775994	0.0000776	BTC`;
    const ret = parser(history);
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual({
      tradeDate: new Date("2018-01-22 12:39:44"),
      side: "S",
      price: 0.00011582,
      counterCcy: 'BTC',
      baseCcy: 'XRP',
      amount: 670,
      feeCcy: 'BTC',
      fee: 0.0000776,
      total: 0.0775994,
      ex: 'Binance',
    });
  });

  // TODO: Needs more tests.

});
