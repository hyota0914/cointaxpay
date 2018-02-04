'use strict;'
module.exports.parseBinanceTradeHistory = function(hist) {
  const tradeList = [];
  hist.split(/\r|\n/).forEach(row => {
    const trade = row.trim().split(/\t|,/);
    if (trade.length !== 8 || !trade[2].match(/BUY|SELL/)) return;
    const [baseCcy, counterCcy] = (pair => {
      const tradeCcys = [
        'BTC',
        'ETH',
        'BNB',
        'USDT',
      ];
      for (let ccy of tradeCcys) {
        const index = pair.indexOf(ccy);
        if (index === -1) {
          continue;
        } else if (index === 0) {
          return [ccy, pair.substr(ccy.length - 1)]
        } else {
          return [pair.slice(0, index), ccy]
        }
      }
    })(trade[1]);
    if (!baseCcy || !counterCcy) throw new Error(`Invalid input! "${trade}"`)
    const tradeDateUnixTime = Date.parse(trade[0]);
    if (isNaN(tradeDateUnixTime)) throw new Error(`invalid date: ${trade[0]}`);
    tradeList.push({
      tradeDate  : new Date(tradeDateUnixTime),
      side       : trade[2] === 'BUY' ? "B": "S",
      price      : Number(trade[3]),
      counterCcy,
      baseCcy,
      amount     : Number(trade[4]),
      feeCcy     : trade[7],
      fee        : Number(trade[6]),
      total      : Number(trade[5]),
      ex         : "Binance",
    });
  });
  return tradeList;
}
