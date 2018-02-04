'use strict;';

function defaultBalance(ccy) {
  return {
    ccy: ccy,
    latest: {
      amount: 0,
      priceJpy: 0,
    },
  };
}

function round(num, digits) {
  return Number(Math.round(`${num}e${digits}`) + `e-${digits}`);
}

function floor(num) {
  return Number(Math.trunc(num));
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
        : floor(trade.total * trade.counterCcyMarketPrice
          - trade.amount * trade.priceJpy);
    } else if (trade.side === 'S') {
      // If side is sell, need to calc profit and loss of base ccy.
      profitAndLoss = floor(trade.amount * trade.priceJpy
        - trade.amount * baseCcyBalance.latest.priceJpy);
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

function calcTotalProfitAndLoss(trades) {
  return trades.reduce((current, t) => {
    current.latest += t.pl;
    return current;
  }, {
    latest: 0,
    history: [
    ],
  });
}

module.exports = function calcProfitAndLoss(trades, initialBalance) {
  let balance = initialBalance || [];
  trades.sort(sortTradeByDateAsc);
  trades = trades.map((trade) => {
    [trade, balance] = calcProfitAndLossPerTrade(trade, balance);
    return trade;
  });
  return [trades, balance, calcTotalProfitAndLoss(trades)];
}
