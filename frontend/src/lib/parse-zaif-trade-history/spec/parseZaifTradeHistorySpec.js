parser = require('../index.js').parseZaifTradeHistory;
describe("Parse Zaif Trade History", function() {
  it("parses buy trade data", function() {
    const history = `注文	価格	数量	手数料	ボーナス	日時
      買い	1851970JPY	0.0034BTC		3.1円	2018/01/10 11:17`;
    const ret = parser(history);
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual({
      tradeDate  : new Date(1515550620000),
      side       : "B",
      price      : 1851970,
      counterCcy : 'JPY',
      baseCcy    : 'BTC',
      amount     : 0.0034,
      feeCcy     : '',
      fee        : 0,
      bonusCcy   :'円',
      bonus      : 3.1,
      total      : 6296.697999999999,
    });
  });

  it("parses sell trade data", function() {
    const history = `注文	価格	数量	手数料	ボーナス	日時
      売り	1937000JPY	0.0742BTC		14.3円	2017/12/09 10:50`;
    const ret = parser(history);
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual({
      tradeDate  : new Date(1512784200000),
      side       : "S",
      price      : 1937000,
      counterCcy : 'JPY',
      baseCcy    : 'BTC',
      amount     : 0.0742,
      feeCcy     : '',
      fee        : 0,
      bonusCcy   :'円',
      bonus      : 14.3,
      total      : 143725.4,
    });
  });

  it("parses cross trade data", function() {
    const history = `買い	0.00059894BTC	1437MONA	1.437MONA		2018/01/05 11:34`;
    const ret = parser(history);
    expect(ret.length).toBe(1);
    expect(ret[0]).toEqual({
      tradeDate  : new Date(1515119640000),
      side       : "B",
      price      : 0.00059894,
      counterCcy : 'BTC',
      baseCcy    : 'MONA',
      amount     : 1437,
      feeCcy     : 'MONA',
      fee        : 1.437,
      bonusCcy   : '',
      bonus      : 0,
      total      : 0.8606767799999999,
    });
  });

});
