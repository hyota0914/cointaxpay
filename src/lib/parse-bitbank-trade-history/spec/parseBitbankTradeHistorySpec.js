parser = require('../index.js').parseBitbankTradeHistory;
describe("Parse Bitbank Trade History", function() {
  it("parses buy trade data", function() {
    const history = `注文ID,取引ID,通貨ペア,売/買,数量,価格,手数料,M/T,取引日時
      6769750,2213863,xrp_jpy,buy,7825.4208,115.500,0.0000,taker,2018/01/18 01:44:50`;
    const ret = parser(history);
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual({
      tradeDate: new Date("2018/01/18 01:44:50"),
      side: "B",
      price: 115.500,
      counterCcy: "JPY",
      baseCcy: "XRP",
      amount: 7825.4208,
      feeCcy: "XRP",
      fee: 0,
      total: 903836.1024,
      ex: "Bitbank",
    });
  });

  it("parses sell trade data", function() {
    const history = `注文ID,取引ID,通貨ペア,売/買,数量,価格,手数料,M/T,取引日時
      1722132,490892,bcc_jpy,sell,1.7551,245000,0.0000,taker,2017/12/22 22:38:03`;
    const ret = parser(history);
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual({
      tradeDate: new Date("2017/12/22 22:38:03"),
      side: "S",
      price: 245000,
      counterCcy: "JPY",
      baseCcy: "BCC",
      amount: 1.7551,
      feeCcy: "JPY",
      fee: 0,
      total: 429999.5,
      ex: "Bitbank",
    });
  });

  it("parses cross trade data", function() {
    const history = `注文ID,取引ID,通貨ペア,売/買,数量,価格,手数料,M/T,取引日時
      16515272,174209,mona_btc,buy,54.0757,0.00065087,0.00000000,maker,2017/12/03 21:32:47`;
    const ret = parser(history);
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual({
      tradeDate: new Date("2017/12/03 21:32:47"),
      side: "B",
      price: 0.00065087,
      counterCcy: "BTC",
      baseCcy: "MONA",
      amount: 54.0757,
      feeCcy: "MONA",
      fee: 0,
      total: 0.035196251,
      ex: "Bitbank",
    });
  });

  // TODO: Needs more tests.

});
