'use strict;'
module.exports.parseBitbankTradeHistory = function(hist) {
  const tradeList = [];
  hist.split(/\r|\n/).forEach(row => {
    const trade = row.trim().split(/\t|,/);
    if (trade.length !== 9 || !trade[2].match(/[a-z]{1,}_[a-z]{1,}/)) return;
    const [baseCcy, counterCcy] = trade[2].split('_').map(x => x.toUpperCase());
    const tradeDateUnixTime = Date.parse(trade[8]);
    if (isNaN(tradeDateUnixTime)) throw new Error(`Invalid input! "${trade}"`);
    const total = Math.abs(Number(Math.round((trade[4] * trade[5]) + 'e9') + 'e-9'));
    tradeList.push({
      exOrderId  : trade[0],
      exTradeId  : trade[1],
      tradeDate  : new Date(tradeDateUnixTime),
      side       : trade[3] === 'buy' ? "B" : "S",
      price      : Number(trade[5]),
      counterCcy,
      baseCcy,
      amount     : Number(trade[4]),
      feeCcy     : baseCcy,
      fee        : Number(trade[6]),
      total      : total,
      ex         : "Bitbank",
    });
  });
  return tradeList;
}
