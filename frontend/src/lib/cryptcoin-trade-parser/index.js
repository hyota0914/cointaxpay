var exports = module.exports = {};

const SIDE_BUY = 0;
const SIDE_SELL = 1;

/**
 * parse trade data done at zaif.
 */
exports.parseZaifData = (data) => {
  let rows = data.split(/\r|\n/);
  let tradeList = [];
  rows.forEach((r) => {
    try {
      let x = r.split(/\t|,/);
      if (x[0] !== '買い' && x[0] !== '売り') {
        return;
      }
      let side = x[0] === '買い' ? SIDE_BUY: SIDE_SELL;
      let price;
      let counterCcy;
      {
        let re = /([0-9.]{1,})(\D{1,})/i;
        let founded = x[1].match(re);
        if (founded) {
          price = founded[1];
          counterCcy = founded[2];
        }
      }
      let amount;
      let baseCcy;
      {
        let re = /([0-9.]{1,})(\D{1,})/i;
        let founded = x[2].match(re);
        if (founded) {
          amount = founded[1];
          baseCcy = founded[2];
        }
      }
      let total = price * amount;
      let fee;
      let feeCcy;
      {
        let re = /([0-9.]{1,})(\D{1,})/i;
        let founded = x[3].match(re);
        if (founded) {
            fee = founded[1];
            feeCcy = founded[2];
        }
      }
      let bonus;
      let bonusCcy;
      {
        let re = /([0-9.]{1,})(\D{1,})/i;
        let founded = x[4].match(re);
        if (founded) {
            bonus = founded[1];
            bonusCcy = founded[2];
        }
      }
      let tradeDate = new Date(Date.parse(x[5]));
      tradeList.push({
        tradeDate  : tradeDate,
        side       : side,
        price      : price,
        counterCcy : counterCcy,
        baseCcy    : baseCcy,
        amount     : amount,
        feeCcy     : feeCcy,
        fee        : fee,
        bonusCcy   : bonusCcy,
        bonus      : bonus,
        total      : total,
      });
    } catch(exception) {
      console.log(exception);
    }
  });
  console.log(tradeList);
  return tradeList;
}

/**
 * parse trade data done at Binance.
 */
exports.parseBinanceData = (data) => {
  let rows = data.split(/\r|\n/);
  let tradeList = [];
  rows.forEach((r) => {
    try {
      let x = r.split(/\t|,/);
      let tradeDate = new Date(Date.parse(x[0]));
      let side = x[2] === 'BUY' ? SIDE_BUY: SIDE_SELL;
      let price = x[3];
      let amount = x[4];
      let total = x[5];
      let fee = x[6];
      let feeCcy = x[7];
      let counterCcy;
      let baseCcy;
      {
        let pair = x[1];
        let feeCcyIdx = pair.indexOf(feeCcy);
        if (feeCcy === 0) {
          counterCcy = feeCcy;
          baseCcy = pair.substr(feeCcy.length - 1);
        } else {
          baseCcy = feeCcy;
          counterCcy = pair.slice(0, feeCcyIdx);
        }
      }
      tradeList.push({
        tradeDate  : tradeDate,
        side       : side,
        price      : price,
        counterCcy : counterCcy,
        baseCcy    : baseCcy,
        amount     : amount,
        feeCcy     : feeCcy,
        fee        : fee,
        total      : total,
      });
    } catch(exception) {
      console.log(exception);
    }
  });
  console.log(tradeList);
  return tradeList;
}

/**
 * parse trade data done at Bitbank.
 */
exports.parseBitbankData = (data) => {
  let rows = data.split(/\r|\n/);
  let tradeList = [];
  rows.forEach((r) => {
    try {
      let x = r.split(/\t|,/);
      let exOrderId = x[0];
      let exTradeId = x[1];
      let counterCcy;
      let baseCcy;
      {
        let pair = x[2].split('_');
        counterCcy = pair[0];
        baseCcy = pair[1];
      }
      let side = x[3] === 'buy' ? SIDE_BUY: SIDE_SELL;
      let amount = x[4];
      let price = x[5];
      let fee = x[6];
      let feeCcy = counterCcy;
      let tradeDate = new Date(Date.parse(x[8]));
      let total = price * amount;
      tradeList.push({
        exOrderId  : exOrderId,
        exTradeId  : exTradeId,
        tradeDate  : tradeDate,
        side       : side,
        price      : price,
        counterCcy : counterCcy,
        baseCcy    : baseCcy,
        amount     : amount,
        feeCcy     : feeCcy,
        fee        : fee,
        total      : total,
      });
    } catch(exception) {
      console.log(exception);
    }
  });
  console.log(tradeList);
  return tradeList;
}

/**
 * parse trade data done at Coincheck
 */
exports.parseCoincheckData = (data) => {

  let rows = data.split(/\r|\n/);
  let tradeList = [];
  let fetchClosedPrice = require('../cc-closed-price').fetchClosedPrice;
  let tmpRow;
  rows.forEach((r) => {
    try {
      let x = r.split(/\t|,/);
      let ope = x[2];
      if (!ope) {
        return;
      }
      if (ope.match(/.*入金.*/)) {
        return;
      }
      if (ope.match(/.*送金.*/)) {
        return;
      }
      if (ope.match(/.*出金.*/)) {
        return;
      }
      if (ope.match(/.*売却.*|.*購入.*/)) {
        if (!tmpRow) {
          tmpRow = x;
          return;
        }
        let baseRow;
        let counterRow;
        if (x[4] == 'JPY') {
          baseRow = x;
          counterRow = tmpRow;
        } else {
          baseRow = tmpRow;
          counterRow = x;
        }

        let baseCcy = baseRow[4];
        let counterCcy = counterRow[4];
        let side = baseRow[3] <= 0 ? SIDE_BUY : SIDE_SELL;
        let exTradeId = baseRow[0] + "," + counterRow[0];
        let amount = Math.abs(counterRow[3]);
        let price = Math.abs(baseRow[3]/counterRow[3]);
        let tradeDate = new Date(Date.parse(baseRow[1]));
        let total = Math.abs(baseRow[3]);

        tradeList.push({
          exTradeId  : exTradeId,
          tradeDate  : tradeDate,
          side       : side,
          price      : price,
          counterCcy : counterCcy,
          baseCcy    : baseCcy,
          amount     : amount,
          total      : total,
        });

        tmpRow = undefined;
        return;
      }
    } catch(exception) {
      console.log(exception);
    }
  });
  
  console.log(tradeList);
  return tradeList;
}



