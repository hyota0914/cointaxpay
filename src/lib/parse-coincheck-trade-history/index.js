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
    row = row.split(/\t|,/);
    let isValidFormat = true;
    const tradeDateUnixTime = Date.parse(row[1]);
    if (!tradeDateUnixTime || isNaN(tradeDateUnixTime)) isValidFormat = false;
    if (!row[3].match(/^[-0-9.]{1,}$/)) isValidFormat = false;
    if (!isValidFormat) throw new Error(`Invalid data format!: ${row}`);
    if (!tmpRow) {
      tmpRow = row;
      return;
    }
    let [base, counter] = [row, tmpRow];
    if (base[4] === 'JPY' || (base[4] === 'BTC' && counter[4] !== 'JPY')) {
      let tmp = base;
      base = counter;
      counter = tmp;
    }
    let price = counter[3]/base[3];
    price = Math.abs(Number(Math.round(price + 'e9') + 'e-9'));
    tradeList.push({
      exTradeId  : `${base[0].trim()},${counter[0].trim()}`,
      tradeDate  : new Date(tradeDateUnixTime),
      side       : counter[3] <= 0 ? "B": "S",
      price      : price,
      counterCcy : counter[4],
      baseCcy    : base[4],
      amount     : Math.abs(base[3]),
      total      : Math.abs(counter[3]),
      ex         : "Coincheck",
    });
    tmpRow = undefined;
  });
  return tradeList;
}
