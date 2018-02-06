'use strict;'

function isValid(t) {
  const regNum = new RegExp(/^[-0-9.]{1,}$/);
  return t.length === 5
    && !isNaN(Date.parse(t[1]))
    && (t[2] === "売却" || t[2] === "購入")
    && t[3].match(regNum)
    && t[4].match(/[a-zA-Z0-9]+/);
}

module.exports.parseCoincheckTradeHistory = function(hist) {
  const trades = hist.split(/\r|\n/).filter(row => row.match(/.*売却.*|.*購入.*/));
  if (trades.length % 2 !== 0) {
    throw new Error("Invalid data number!");
  }
  const result = [];
  let tmp;
  trades.forEach(row => {
    row = row.split(/\t|,/);
    if (!isValid(row)) throw new Error(`Invalid data format!: ${row}`);
    if (!tmp) {
      tmp = row;
      return;
    }
    let base, counter;
    if (row[2] === '購入' && row[3] > 0) {
      [base, counter] = [row, tmp];
    } else {
      [base, counter] = [tmp, row];
    }
    let price = Math.abs(Number(Math.round(counter[3]/base[3] + 'e9') + 'e-9'));
    result.push({
      tradeDate  : new Date(base[1]),
      side       : base[2] === '購入' ? "B": "S",
      price      : price,
      counterCcy : counter[4],
      baseCcy    : base[4],
      amount     : Math.abs(base[3]),
      total      : Math.abs(counter[3]),
      ex         : "Coincheck",
    });
    tmp = undefined;
  });
  return result;
}
