'use strict;'

function isValid(t) {
  const regNum = new RegExp(/^[-0-9.]{1,}$/);
  return t.length === 9 
    && t[2].match(/[a-z0-9]{1,}_[a-z0-9]{1,}/)
    && (t[3] === "buy" || t[3] === "sell")
    && t[4].match(regNum)
    && t[5].match(regNum)
    && t[6].match(regNum)
    && !isNaN(Date.parse(t[8]));
}

module.exports.parseBitbankTradeHistory = function(hist) {
  const result = [];
  hist.split(/\r|\n/).forEach(row => {
    if (row.match(/注文ID.*/)) return;
    const t = row.trim().split(/\t|,/);
    if (!isValid(t)) throw new Error(`Invalid input! "${t}"`);
    const total = Math.abs(Number(Math.round((t[4] * t[5]) + 'e9') + 'e-9'));
    const [baseCcy, counterCcy] = t[2].split('_').map(x => x.toUpperCase());
    result.push({
      tradeDate: new Date(t[8]),
      side: t[3] === 'buy' ? "B": "S",
      price: Number(t[5]),
      baseCcy,
      counterCcy,
      amount: Number(t[4]),
      feeCcy: t[3] === 'buy' ? baseCcy : counterCcy,
      fee: Number(t[6]),
      total: total,
      ex: "Bitbank",
    });
  });
  return result;
}
