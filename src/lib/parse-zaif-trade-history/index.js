'use strict;'

function isValid(t) {
  const regNum = new RegExp(/^[-0-9.]{1,}$/);
  return t.length === 8
    && t[0].match(/[a-z0-9]{1,}_[a-z0-9]{1,}/)
    && (t[1] === "bid" || t[1] === "ask")
    && t[2].match(regNum)
    && t[3].match(regNum)
    && (t[4] === '' || t[4].match(regNum))
    && (t[5] === '' || t[5].match(regNum))
    && !isNaN(Date.parse(t[6]));
}

module.exports.parseZaifTradeHistory = function(hist) {
  //format: "マーケット","取引種別","価格","数量","取引手数料","ボーナス円","日時","コメント"
  const result = [];
  hist.split(/\r|\n/).forEach(row => {
    if (row.match(/マーケット.*/)) return;
    const t= row.trim().replace(/"/g, '').split(/\t|,/);
    if (!isValid(t)) throw new Error(`Invalid data format!: ${t}`);
    const [baseCcy, counterCcy] = t[0].split('_').map(x => x.toUpperCase());
    const price = Number(t[2]);
    const amount = Math.abs(Number(t[3]));
    const fee = Number(t[4]);
    const feeCcy = t[1] === 'bid' ? baseCcy : counterCcy;
    const bonus = Number(t[5]);
    const bonusCcy = 'JPY';
    const total = Math.abs(Number(Math.round(price * amount + 'e9') + 'e-9'));
    result.push({
      tradeDate: new Date(t[6]),
      side: t[1] === 'bid' ? "B" : "S",
      price: price,
      counterCcy: counterCcy,
      baseCcy: baseCcy,
      amount: amount,
      feeCcy: feeCcy,
      fee: fee,
      bonusCcy: bonusCcy,
      bonus: bonus,
      total: total,
      ex: "Zaif_cash",
    });
  });
  return result;
}
