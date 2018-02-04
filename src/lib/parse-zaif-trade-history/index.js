'use strict;'
module.exports.parseZaifTradeHistory = function(hist) {
  //format: "マーケット","取引種別","価格","数量","取引手数料","ボーナス円","日時","コメント"
  const tradeList = [];
  hist.split(/\r|\n/).forEach(row => {
    const trade = row.trim().replace(/"/g, '').split(/\t|,/);
    if (trade.length !== 8 || trade[0].match(/マーケット/)) return;
    let isValidFormat = true;
    const tradeDateUnixTime = Date.parse(trade[6]);
    if (!tradeDateUnixTime || isNaN(tradeDateUnixTime)) isValidFormat = false;
    if (!trade[0].match(/^[a-z0-9]*_[a-z0-9]*/)) isValidFormat = false;
    if (!trade[1].match(/bid|ask/)) isValidFormat = false;
    if (!trade[2].match(/^[-0-9.]{1,}$/)) isValidFormat = false;
    if (!trade[3].match(/^[-0-9.]{1,}$/)) isValidFormat = false;
    if (!trade[4].match(/^[-0-9.]{1,}$|^$/)) isValidFormat = false;
    if (!trade[5].match(/^[-0-9.]{1,}$|^$/)) isValidFormat = false;
    if (!isValidFormat) throw new Error(`Invalid data format!: ${trade}`);
    const [baseCcy, counterCcy] = trade[0].split('_').map(x => x.toUpperCase());
    const tradeDate = new Date(tradeDateUnixTime)
    const price = Number(trade[2]);
    const amount = Math.abs(Number(trade[3]));
    const fee = Number(trade[4]);
    const feeCcy = 'JPY';
    const bonus = Number(trade[5]);
    const bonusCcy = 'JPY';
    const total = Math.abs(Number(Math.round(price * amount + 'e9') + 'e-9'));
    tradeList.push({
      tradeDate: tradeDate,
      side: trade[1] === 'bid' ? "B" : "S",
      price: price,
      counterCcy: counterCcy,
      baseCcy: baseCcy,
      amount: amount,
      feeCcy: feeCcy,
      fee: fee,
      bonusCcy: bonusCcy,
      bonus: bonus,
      total: total,
      ex: "Zaif",
    });
  });
  return tradeList;
}
