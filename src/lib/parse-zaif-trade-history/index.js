'use strict;'
module.exports.parseZaifTradeHistory = function(hist) {
  const tradeList = [];
  hist.split(/\r|\n/).forEach(row => {
    const trade = row.trim().split(/\t|,/);
    if (trade.length !== 6 || !trade[0].match(/買い|売り/)) return;
    const splitAmountAndCcy = function(amountAndCcy) {
      const r = amountAndCcy.match(/^([0-9.]{1,})(\D{1,})$/i);
      return r && r.length === 3 ? [Number(r[1]), r[2]] : [0, ""];
    };
    const [price, counterCcy] = splitAmountAndCcy(trade[1]);
    const [amount, baseCcy] = splitAmountAndCcy(trade[2]);
    const [fee, feeCcy] = splitAmountAndCcy(trade[3]);
    const [bonus, bonusCcy] = splitAmountAndCcy(trade[4]);
    const tradeDateUnixTime = Date.parse(trade[5]);
    if (isNaN(tradeDateUnixTime)) throw new Error(`invalid date: ${trade[5]}`);
    tradeList.push({
      tradeDate: new Date(tradeDateUnixTime),
      side: trade[0] === '買い' ? "B" : "S",
      price,
      counterCcy,
      baseCcy,
      amount,
      feeCcy,
      fee,
      bonusCcy,
      bonus,
      total: price * amount,
      ex: "zaif",
    });
  });
  return tradeList;
}
