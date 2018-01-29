'use strict;'
module.exports.parseCoincheckTradeHistory = function(hist) {
  const buySellTrade = hist.split(/\r|\n/).filter(row => {
    const trade = row.trim().split(/\t|,/);
    return trade.length === 5 && trade[2].match(/売却|購入/)
  });
  if (buySellTrade.length % 2 !== 0) {
    throw new Error("Invalid data number!");
  }
  const tradeList = [];
  let tmpRow;
  buySellTrade.forEach(row => {
    if (!tmpRow) {
      tmpRow = row;
      return;
    }
    let [base, counter] = [row, tmpRow].map((i) => i.split(/\t|,/))
    if (base[4] === 'JPY') {
      let tmp = base;
      base = counter;
      counter = tmp;
    }
    const tradeDateUnixTime = Date.parse(base[1]);
    if (isNaN(tradeDateUnixTime)) throw new Error(`Invalid input: "${base}"`);
    tradeList.push({
      exTradeId  : `${base[0].trim()},${counter[0].trim()}`,
      tradeDate  : new Date(tradeDateUnixTime),
      side       : counter[3] <= 0 ? "B": "S",
      price      : Math.abs(counter[3]/base[3]),
      counterCcy : counter[4],
      baseCcy    : base[4],
      amount     : Math.abs(base[3]),
      total      : Math.abs(counter[3]),
      ex         : "cc",
    });
    tmpRow = undefined;
  });
  return tradeList;
}
