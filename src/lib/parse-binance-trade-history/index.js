'use strict;'

function isValid(t) {
  const regNum = new RegExp(/^[-0-9.]{1,}$/);
  return t.length === 8
    && !isNaN(Date.parse(t[0]))
    && t[1].match(/[a-zA-Z0-9]+/)
    && (t[2] === "BUY" || t[2] === "SELL")
    && t[3].match(regNum)
    && t[4].match(regNum)
    && t[5].match(regNum)
    && (t[6].match(regNum) || t[6] === '')
    && (t[7].match(/[a-zA-Z0-9]+/) || t[7] === '');
}

const returnPairFromMarket = (() => {
  const ccyList = [
    'BTC',
    'ETH',
    'BNB',
    'USDT',
  ];
  return (market) => {
    for (let i = 0; i < ccyList.length; ++i) {
      const ccy = ccyList[i];
      const index = market.indexOf(ccy);
      if (index === -1) {
        continue;
      } else if (index === 0) {
        return [ccy, market.substr(ccy.length - 1)]
      } else {
        return [market.slice(0, index), ccy]
      }
    }
  }
})();

module.exports.parseBinanceTradeHistory = function(hist) {
  const result = [];
  hist.split(/\r|\n/).forEach(row => {
    if (row.match(/Date.*/)) return;
    const t = row.trim().split(/\t|,/);
    if (!isValid(t)) throw new Error(`Invalid input! "${t}"`);
    const [baseCcy, counterCcy] = returnPairFromMarket(t[1]);
    if (!baseCcy || !counterCcy) throw new Error(`Invalid input! "${t}"`)
    if (t[6] !== '') {
      if (t[2] === 'BUY' && t[7] !== baseCcy) {
        throw new Error(`Invalid input! "${t}"`);
      }
      if (t[2] === 'SELL' && t[7] !== counterCcy) {
        throw new Error(`Invalid input! "${t}"`);
      }
    }
    result.push({
      tradeDate: new Date(t[0]),
      side: t[2] === 'BUY' ? "B": "S",
      price: Number(t[3]),
      counterCcy,
      baseCcy,
      amount: Number(t[4]),
      feeCcy: t[7],
      fee: Number(t[6]),
      total: Number(t[5]),
      ex: "Binance",
    });
  });
  return result;
}
