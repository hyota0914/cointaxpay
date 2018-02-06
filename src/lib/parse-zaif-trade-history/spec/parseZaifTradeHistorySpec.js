'use strict;';

parser = require('../index.js').parseZaifTradeHistory;
describe("Parse Zaif Trade History", function() {
  it("parses buy trade data", function() {
    const history = [
      '"マーケット","取引種別","価格","数量","取引手数料","ボーナス円","日時","コメント"',
      '"xem_jpy","bid","19.4998","13582","13.582",,"2017-07-25 12:22:10.982740",',
    ].join("\n");
    const ret = parser(history);
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual({
      tradeDate: new Date("2017-07-25 12:22:10.982740"),
      side: "B",
      price: 19.4998,
      counterCcy: 'JPY',
      baseCcy: 'XEM',
      amount: 13582,
      feeCcy: 'XEM',
      fee: 13.582,
      bonusCcy:'JPY',
      bonus: 0,
      total: 264846.2836,
      ex: 'Zaif',
    });
  });

  it("parses sell trade data", function() {
    const history = [
      '"マーケット","取引種別","価格","数量","取引手数料","ボーナス円","日時","コメント"',
      '"bch_jpy","ask","173700","0.6038","314.64018","10","2017-12-09 12:28:27.601999",',
    ].join("\n");
    const ret = parser(history);
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual({
      tradeDate: new Date("2017-12-09 12:28:27.601999"),
      side: "S",
      price: 173700,
      counterCcy: 'JPY',
      baseCcy: 'BCH',
      amount: 0.6038,
      feeCcy: 'JPY',
      fee: 314.64018,
      bonusCcy:'JPY',
      bonus: 10,
      total: 104880.06,
      ex: 'Zaif',
    });
  });

  it("parses cross trade data", function() {
    const history = [
      '"マーケット","取引種別","価格","数量","取引手数料","ボーナス円","日時","コメント"',
      '"xem_btc","ask","0.000058","194","0.00001125",,"2017-12-21 12:00:28.048333",',
    ].join("\n");
    const ret = parser(history);
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual({
      tradeDate: new Date("2017-12-21 12:00:28.048333"),
      side: "S",
      price: 0.000058,
      counterCcy: 'BTC',
      baseCcy: 'XEM',
      amount: 194,
      feeCcy: 'BTC',
      fee: 0.00001125,
      bonusCcy: 'JPY',
      bonus: 0,
      total: 0.011252,
      ex: 'Zaif',
    });
  });

  // TODO: Needs more tests.

});
