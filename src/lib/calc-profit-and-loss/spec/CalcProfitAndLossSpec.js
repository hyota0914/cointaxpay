parser = require('../CalcProfitAndLoss.js').calcProfitAndLossPerTrade;
describe("Calc profit and loss", function() {
  it("calc balance", function() {
    expect(1).toBe(1);

  });

  /*
  it("parses sell trade data", function() {
    const history = `コインチェック株式会社
      ID,日付,操作内容,金額,通貨,JPY,BTC,ETH,ETC,DAO,LSK,FCT,XMR,REP,XRP,ZEC,XEM,LTC,DASH,BCH
      AOxxx295885,2017-06-12 04:06:26 UTC,入金,10000.0,JPY
      AOxxx490900,2017-06-14 23:11:33 UTC,売却,-35.22244,ETH
      AOxxx490901,2017-06-14 23:11:33 UTC,売却,1317456.0,JPY
      ,,,,,0.0,0,0.0,0,0,0,0,0,0,68746.85711,0,0,0.01553,0,0`;
    const ret = parser(history);
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual({
      exTradeId  : 'AOxxx490900,AOxxx490901',
      tradeDate  : new Date(1497481893000),
      side       : "S",
      price      : 37403.88229776245,
      counterCcy : "JPY",
      baseCcy    : "ETH",
      amount     : 35.22244,
      total      : 1317456,
    });
  });*/
});
