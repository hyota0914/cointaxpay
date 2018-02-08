'use strict;';

function defaultBalance(ccy) {
  return {
    ccy: ccy,
    amount: 0,
    priceJ: 0,
  };
}

function round(num, digits) {
  return Number(Math.round(`${num}e${digits}`) + `e-${digits}`);
}

function CalcProfitAndLoss () {};
CalcProfitAndLoss.fetchMarketPrice = (function() {
  const useMarketRateInCoincheck = [
    'BTC',
    'ETH',
    'ETC',
    'LSK',
    'FCT',
    'XMR',
    'XRP',
    'ZEC',
    'XEM',
    'LTC',
    'DASH',
    'BCH',
  ];
  return (date, ccy) => {
    if (ccy === 'JPY') return 1;
    let price;
    if (useMarketRateInCoincheck.includes(ccy)) {
      let fn = require('../cc-closed-price').fetchClosedPrice;
      price = fn(date, ccy);
    }
    price = Number(price);
    if (!price || isNaN(price)) {
      throw new Error(`Market rate of ccy(${ccy}) on ${date} is not available yet.`);
    }
    return price;
  }
})();

function returnTotalAveragePrice(balanceBefore, amount, priceJ) {
  if (balanceBefore.amount + amount === 0) {
    return priceJ;
  }
  let v = (balanceBefore.amount * balanceBefore.priceJ)
    + (amount * priceJ);
  let result = v / (balanceBefore.amount + amount)
  if (isNaN(result) || !isFinite(result)) {
    console.log(balanceBefore, amount, priceJ);
    throw new Error(`Failed to calc jpy price.`);
  }
  return result;
}

function returnPayedJpyToExchange(tradeDate, payedCcy, payedAmount) {
  let rate = CalcProfitAndLoss.fetchMarketPrice(tradeDate, payedCcy)
  return [rate, rate * payedAmount];
}

function balanceToArray(balance) {
  let result = [];
  Object.keys(balance).forEach((k) => {
    result.push(balance[k]);
  });
  return result;
}

function balanceToObject(data) {
  let result = {};
  data.forEach((k) => {
    result[k.ccy] = {
      ccy: k.ccy,
      amount: k.amount,
      priceJ: k.priceJ,
    };
  });
  return result;
}

function calcProfitAndLossPerTrade(trade, balance) {
  const baseCcy = trade.baseCcy;
  const baseCcyBalance = balance[baseCcy] || defaultBalance(baseCcy);
  const counterCcy = trade.counterCcy;
  const counterCcyBalance = balance[counterCcy] || defaultBalance(counterCcy);

  let pl = {
    amount : trade.amount,
    total : trade.amount * trade.price,
    price : trade.price,
    pl : 0,
    balanceBefore : {
      baseCcy: Object.assign({}, baseCcyBalance),
      counterCcy: Object.assign({}, counterCcyBalance),
    },
    balanceAfter : {},
  }

  // Reflect fee to amount or total
  if (trade.fee && trade.fee !== 0) {
    if (trade.side === 'B' && trade.feeCcy === baseCcy) {
      pl.amount -= trade.fee;
    } else if (trade.side === 'S' && trade.feeCcy === counterCcy) {
      pl.total -= trade.fee;
    } else {
      console.log(trade);
      throw new Error(`Fee ccy is not valid!`);
    }
  }

  // Reflect fee to price
  if (trade.fee) {
    pl.price = pl.total / pl.amount;
  }

  // Calc price in JPY
  if (counterCcy === 'JPY') {
    pl.priceJ = pl.price;
    pl.rate = 1;
  } else {
    if (trade.side === 'B') {
      // Assume counter ccy changed to jpy, and bought base ccy.
      let [rate, payedValue] = returnPayedJpyToExchange(
        new Date(trade.tradeDate), counterCcy, pl.total);
      pl.rate = rate;
      pl.priceJ = payedValue / pl.amount;
    } else {
      // Assume base ccy changed to jpy, and bought counter ccy.
      let [rate, payedValue] = returnPayedJpyToExchange(
        new Date(trade.tradeDate), baseCcy, pl.amount);
      pl.rate = rate;
      pl.priceJ = payedValue / pl.total;
    }
  }
  
  // Update balance and avg price
  if (trade.side === 'B') {
    baseCcyBalance.amount = round(baseCcyBalance.amount + pl.amount, 9);
    counterCcyBalance.amount = round(counterCcyBalance.amount - pl.total, 9);
    baseCcyBalance.priceJ = returnTotalAveragePrice(
      pl.balanceBefore.baseCcy, pl.amount, pl.priceJ);
    if (counterCcy === 'JPY') {
      counterCcyBalance.priceJ = 1;
    }
  } else {
    baseCcyBalance.amount = round(baseCcyBalance.amount - pl.amount, 9);
    counterCcyBalance.amount = round(counterCcyBalance.amount + pl.total, 9);
    if (counterCcy === 'JPY') {
      counterCcyBalance.priceJ = returnTotalAveragePrice(
        pl.balanceBefore.counterCcy, pl.total, 1);
    } else {
      counterCcyBalance.priceJ = returnTotalAveragePrice(
        pl.balanceBefore.counterCcy, pl.total, pl.priceJ);
    }
  }
  if (baseCcyBalance.amount === 0) {
    baseCcyBalance.priceJ = 0;
  }
  if (counterCcyBalance.amount === 0) {
    counterCcyBalance.priceJ = 0;
  }

  // Calc profit and loss
  if (trade.side === 'B') {
    // If side is buy, need to calc profit and loss of counter ccy.
    if (counterCcy === 'JPY') {
      pl.pl = 0;
    } else {
      pl.pl = pl.total * pl.rate
        - pl.total * pl.balanceBefore.counterCcy.priceJ;
    }
  } else if (trade.side === 'S') {
    // If side is sell, need to calc profit and loss of base ccy.
    if (counterCcy === 'JPY') {
      pl.pl = pl.amount * pl.priceJ
        - pl.amount * pl.balanceBefore.baseCcy.priceJ;
    } else {
      pl.pl = pl.amount * pl.rate
        - pl.amount * pl.balanceBefore.baseCcy.priceJ;
    }
  }

  // Reflect bonus to pl
  if (trade.bonus && trade.bonusCcy === 'JPY') {
    pl.pl += trade.bonus;
  } else if (trade.bonus && trade.bonusCcy !== 'JPY') {
    throw new Error(`Invalid bonus ccy: ${trade.bonusCcy}`);
  }

  // Reflect fee to pl
  if (trade.fee) {
    if (trade.side === 'S' && counterCcy !== 'JPY') {
      pl.pl -= trade.fee * CalcProfitAndLoss.fetchMarketPrice(
        new Date(trade.tradeDate), trade.feeCcy);
    }
  }
  
  pl.pl = Math.floor(pl.pl);
  if (isNaN(pl.pl)) {
    console.log(trade);
    console.log(pl);
    throw new Error(`Failed to calc profit and loss`);
  }

  // Update data
  pl.balanceAfter = {
    baseCcy: Object.assign({}, baseCcyBalance),
    counterCcy: Object.assign({}, counterCcyBalance),
  };
  trade.pl = pl;
  balance[baseCcy] = baseCcyBalance;
  balance[counterCcy] = counterCcyBalance;
  return [trade, balance];
}

const sortTradeByDateAsc = (t1, t2) => { 
  const d1 = Date.parse(t1.tradeDate);
  const d2 = Date.parse(t2.tradeDate);
  if (d1 !== d2) {
    return d1<d2 ? -1 : 1;
  }
  const id1 = Number(t1.rowId);
  const id2 = Number(t2.rowId);
  return id1<id2 ? -1 : id1>id2 ? 1: 0;
};

CalcProfitAndLoss.calcProfitAndLoss = (trades, initialBalance) => {
  let balance = Object.assign({}, balanceToObject(initialBalance));
  trades.sort(sortTradeByDateAsc);
  trades = trades.map((trade) => {
    [trade, balance] = calcProfitAndLossPerTrade(trade, balance);
    return trade;
  });
  return [trades, balanceToArray(balance)];
}

CalcProfitAndLoss.calcTotalProfitAndLoss = (year, trades) => {
  try {
    trades.sort(sortTradeByDateAsc);
    const history = (() => {
      const set = {}
      const dt = new Date(`${year}-01-01 00:00:00 GMT+0900`);
      while (dt.getFullYear() === Number(year)) {
        set[dt.getTime()] = {pl: 0, total: 0};
        dt.setTime(dt.getTime() + 1000*60*60*24);
      }
      return set;
    })();
    const plTotal = trades.reduce((current, t) => {
      let dt = new Date(t.tradeDate);
      dt = new Date(dt.getTime() + (dt.getTimezoneOffset()*60*1000))
      dt = new Date(`${dt.getUTCFullYear()}-${dt.getUTCMonth() + 1}-${dt.getUTCDate()} GMT+0900`);
      current.latest += t.pl.pl || 0;
      history[dt.getTime()].pl += t.pl.pl || 0;
      return current;
    }, {
      latest: 0,
    });
    plTotal.history = Object.keys(history).map((k) => ({
      date: new Date(Number(k)), 
      pl: round(history[k].pl, 9), 
    }));
    plTotal.history.sort((a,b) => a.date.getTime() < b.date.getTime() ? -1 : 1);
    plTotal.history = plTotal.history.map((r, idx) => {
      r.total = r.pl;
      if (idx !== 0) {
        r.total = round(r.total + plTotal.history[idx-1].total, 9);
      }
      return r;
    });
    return plTotal;
  } catch (e) {
    console.log(e);
    return {};
  }
}

module.exports = CalcProfitAndLoss;

