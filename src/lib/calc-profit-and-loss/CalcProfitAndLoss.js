'use strict;';

function defaultBalance(ccy) {
  return {
    ccy: ccy,
    latest: {
      amount: 0,
      priceJpy: 1,
    },
  };
}

function round(num, digits) {
  return Number(Math.round(`${num}e${digits}`) + `e-${digits}`);
}

const fetchMarketPrice = (function() {
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
      throw new Error(`Sorry, market rate of ccy(${ccy}) on ${date} is not available yet.`);
    }
    return price;
  }
})();

function calcProfitAndLossPerTrade(trade, balance) {
  const baseCcy = trade.baseCcy;
  const baseCcyBalance = balance[baseCcy] || defaultBalance(baseCcy);
  const counterCcy = trade.counterCcy;
  const counterCcyBalance = balance[counterCcy] || defaultBalance(counterCcy);
  trade.baseBeforeBalance = Object.assign({}, baseCcyBalance.latest);
  trade.counterBeforeBalance = Object.assign({}, counterCcyBalance.latest);

  // Price in jpy
  {
    let counterCcyMarketPrice = fetchMarketPrice(
      new Date(Date.parse(trade.tradeDate)), counterCcy)
    trade.priceJpy = round(counterCcyMarketPrice * trade.price, 9);;
    trade.counterCcyMarketPrice = counterCcyMarketPrice;
  }

  // Base Amount
  {
    let baseAmount = Number(baseCcyBalance.latest.amount);
    if (trade.side === 'B') {
      baseAmount += Number(trade.amount);
    } else {
      baseAmount -= Number(trade.amount);
    }
    baseAmount = round(baseAmount, 9);
    baseCcyBalance.latest.amount = baseAmount;
  }

  // counter Amount
  {
    let counterAmount = Number(counterCcyBalance.latest.amount);
    if (trade.side === 'B') {
      counterAmount -= Number(trade.total);
    } else if (trade.side === 'S') {
      counterAmount += Number(trade.total);
    }
    counterAmount = round(counterAmount, 9);
    counterCcyBalance.latest.amount = counterAmount;
  }
  
  // Total average price
  if (trade.side === 'B') {
    // If side is buy, need to recalc "total average price" of the base ccy.
    baseCcyBalance.latest.priceJpy = round(((trade.baseBeforeBalance.amount * trade.baseBeforeBalance.priceJpy)
      + (trade.amount * trade.priceJpy)) / (trade.baseBeforeBalance.amount + trade.amount), 9);
    if (isNaN(baseCcyBalance.latest.priceJpy) || !isFinite(baseCcyBalance.latest.priceJpy)) {
      console.log(trade);
      throw new Error(`Sorry, failed to calc jpy price`);
    }
  } else if (trade.side === 'S') {
    // If side is sell, need to recalc "total average price" of the counter ccy.
    counterCcyBalance.latest.priceJpy = round(((trade.counterBeforeBalance.amount * trade.counterBeforeBalance.priceJpy)
      + (trade.total * trade.counterCcyMarketPrice)) / (trade.counterBeforeBalance.amount + trade.total), 9);
    if (counterCcy === 'JPY' && counterCcyBalance.latest.priceJpy !== 1) {
      console.log(trade);
      throw new Error(`Sorry, failed to calc jpy balance`);
    }
    if (isNaN(counterCcyBalance.latest.priceJpy) || !isFinite(counterCcyBalance.latest.priceJpy)) {
      console.log(trade);
      throw new Error(`Sorry, failed to calc jpy price`);
    }
  }

  // Calc profit and loss
  {
    let profitAndLoss = 0;
    if (trade.side === 'B') {
      // If side is buy, need to calc profit and loss of counter ccy.
			profitAndLoss = counterCcy === 'JPY' ? 0
        : round(trade.total * trade.counterBeforeBalance.priceJpy
          - trade.amount * trade.priceJpy, 9);
    } else if (trade.side === 'S') {
      // If side is sell, need to calc profit and loss of base ccy.
      profitAndLoss = round(trade.amount * trade.priceJpy
        - trade.amount * baseCcyBalance.latest.priceJpy, 9);
    }
    trade.pl = profitAndLoss;
    if (isNaN(trade.pl) || !isFinite(trade.pl)) {
      console.log(trade);
      throw new Error(`Sorry, failed to calc profit and loss`);
    }
  }

  // Update data
  trade.baseAfterBalance = Object.assign({}, baseCcyBalance.latest);
  trade.counterAfterBalance = Object.assign({}, counterCcyBalance.latest);
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

module.exports.calcProfitAndLoss = (trades, initialBalance) => {
  let balance = initialBalance || [];
  trades.sort(sortTradeByDateAsc);
  trades = trades.map((trade) => {
    [trade, balance] = calcProfitAndLossPerTrade(trade, balance);
    return trade;
  });
  return [trades, balance];
}

module.exports.calcTotalProfitAndLoss = (year, trades) => {
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
      current.latest += t.pl || 0;
      history[dt.getTime()].pl += t.pl || 0;
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

