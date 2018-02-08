describe("Calc profit and loss", function() {
  let module;

  beforeEach(function() {
    module = require('../CalcProfitAndLoss.js');
    spyOn(module, "fetchMarketPrice").and.callFake(
       function(date, ccy) {
         switch (ccy) {
           case 'BTC':
             return 1100000;
           case 'XEM':
             return 30;
           default:
             return 5;
         }
    });
  });

  function testSpecificKeys(t, values) {
    Object.keys(values).forEach((k) => {
      expect(t[k]).toEqual(values[k]);
    });
  }

  function dump(trades) {
    trades.forEach((t) => {
      console.log("=====")
      console.log(t.pl);
      console.log(t.pl.balanceBefore);
      console.log(t.pl.balanceAfter);
    });
  }

  it("calculates right pl when sold at same price.", function() {
    const input = [
      {
        tradeDate: new Date("2017-07-25 12:22:10.982740"),
        side: "B",
        price: 19.4998,
        counterCcy: 'JPY',
        baseCcy: 'XEM',
        amount: 13582,
        feeCcy: 'XEM',
        fee: 0,
        bonusCcy:'JPY',
        bonus: 0,
        total: 264846.2836,
      },
      {
        tradeDate: new Date("2017-07-26 12:22:10.982740"),
        side: "S",
        price: 19.4998,
        counterCcy: 'JPY',
        baseCcy: 'XEM',
        amount: 13582,
        feeCcy: 'JPY',
        fee: 0,
        bonusCcy:'JPY',
        bonus: 0,
        total: 264846.2836,
      },
    ];

    let [trades, balance] = module.calcProfitAndLoss(input, []);

    expect(trades[0].pl).toEqual({
      amount: 13582,
      price: 19.4998,
      priceJ: 19.4998,
      total: 264846.2836,
      pl: 0,
      rate: 1,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 0,
          priceJ: 0,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: 0,
          priceJ: 0,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 13582,
          priceJ: 19.4998,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -264846.2836,
          priceJ: 1,
        },
      },
    });

    expect(trades[1].pl).toEqual({
      amount: 13582,
      price: 19.4998,
      priceJ: 19.4998,
      total: 264846.2836,
      pl: 0,
      rate: 1,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 13582,
          priceJ: 19.4998,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -264846.2836,
          priceJ: 1,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 0,
          priceJ: 0,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: 0,
          priceJ: 0,
        },
      },
    });
  });

  it("calculates right pl when sold at the money.", function() {
    const input = [
      {
        tradeDate: new Date("2017-07-25 12:22:10.982740"),
        side: "B",
        price: 19.4998,
        counterCcy: 'JPY',
        baseCcy: 'XEM',
        amount: 13582,
        feeCcy: 'XEM',
        fee: 0,
        bonusCcy:'JPY',
        bonus: 0,
        total: 264846.2836,
      },
      {
        tradeDate: new Date("2017-07-26 12:22:10.982740"),
        side: "S",
        price: 21.0005,
        counterCcy: 'JPY',
        baseCcy: 'XEM',
        amount: 12000,
        feeCcy: 'JPY',
        fee: 100,
        bonusCcy:'JPY',
        bonus: 0,
        total: 252006,
      },
    ];

    let [trades, balance] = module.calcProfitAndLoss(input, []);

    expect(trades[0].pl).toEqual({
      amount: 13582,
      price: 19.4998,
      priceJ: 19.4998,
      total: 264846.2836,
      pl: 0,
      rate: 1,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 0,
          priceJ: 0,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: 0,
          priceJ: 0,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 13582,
          priceJ: 19.4998,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -264846.2836,
          priceJ: 1,
        },
      },
    });

    expect(trades[1].pl).toEqual({
      amount: 12000,
      price: 20.992166666666666,
      priceJ: 20.992166666666666,
      total: 251906,
      pl: 17908,
      rate: 1,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 13582,
          priceJ: 19.4998,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -264846.2836,
          priceJ: 1,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 1582,
          priceJ: 19.4998,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -12940.2836,
          priceJ: 1,
        },
      },
    });
  });

  it("calculates right pl when sold out of the money.", function() {
    const input = [
      {
        tradeDate: new Date("2017-07-25 12:22:10.982740"),
        side: "B",
        price: 19.4998,
        counterCcy: 'JPY',
        baseCcy: 'XEM',
        amount: 13582,
        feeCcy: 'XEM',
        fee: 0,
        bonusCcy:'JPY',
        bonus: 0,
        total: 264846.2836,
      },
      {
        tradeDate: new Date("2017-07-26 12:22:10.982740"),
        side: "S",
        price: 11.1234,
        counterCcy: 'JPY',
        baseCcy: 'XEM',
        amount: 12000,
        feeCcy: 'JPY',
        fee: 0,
        bonusCcy:'JPY',
        bonus: 0,
        total: 133480.8,
      },
    ];

    let [trades, balance] = module.calcProfitAndLoss(input, []);

    expect(trades[0].pl).toEqual({
      amount: 13582,
      price: 19.4998,
      priceJ: 19.4998,
      total: 264846.2836,
      pl: 0,
      rate: 1,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 0,
          priceJ: 0,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: 0,
          priceJ: 0,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 13582,
          priceJ: 19.4998,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -264846.2836,
          priceJ: 1,
        },
      },
    });

    expect(trades[1].pl).toEqual({
      amount: 12000,
      price: 11.1234,
      priceJ: 11.1234,
      total: 133480.8,
      pl: -100517,
      rate: 1,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 13582,
          priceJ: 19.4998,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -264846.2836,
          priceJ: 1,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 1582,
          priceJ: 19.4998,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -131365.4836,
          priceJ: 1,
        },
      },
    });
  });

  it("calculates right pl when the coin bought two times.", function() {
    const input = [
      {
        tradeDate: new Date("2017-07-25 12:22:10.982740"),
        side: "B",
        price: 10,
        counterCcy: 'JPY',
        baseCcy: 'XEM',
        amount: 10000,
        feeCcy: 'XEM',
        fee: 0,
        bonusCcy:'JPY',
        bonus: 0,
        total: 100000,
      },
      {
        tradeDate: new Date("2017-07-26 12:22:10.982740"),
        side: "B",
        price: 30,
        counterCcy: 'JPY',
        baseCcy: 'XEM',
        amount: 5000,
        feeCcy: 'JPY',
        fee: 0,
        bonusCcy:'JPY',
        bonus: 0,
        total: 150000,
      },
    ];

    let [trades, balance] = module.calcProfitAndLoss(input, []);

    expect(trades[0].pl).toEqual({
      amount: 10000,
      price: 10,
      priceJ: 10,
      total: 100000,
      pl: 0,
      rate: 1,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 0,
          priceJ: 0,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: 0,
          priceJ: 0,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 10000,
          priceJ: 10,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -100000,
          priceJ: 1,
        },
      },
    });

    expect(trades[1].pl).toEqual({
      amount: 5000,
      price: 30,
      priceJ: 30,
      total: 150000,
      pl: 0,
      rate: 1,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 10000,
          priceJ: 10,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -100000,
          priceJ: 1,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 15000,
          priceJ: 16.666666666666668,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -250000,
          priceJ: 1,
        },
      },
    });
  });

  it("calculates right pl of the cross trade.", function() {
    const input = [
      {
        tradeDate: new Date("2017-07-25 12:22:10.982740"),
        side: "B",
        price: 1000000,
        counterCcy: 'JPY',
        baseCcy: 'BTC',
        amount: 1,
        feeCcy: 'BTC',
        fee: 0,
        bonusCcy:'JPY',
        bonus: 0,
        total: 1000000,
      },
      {
        tradeDate: new Date("2017-07-26 12:22:10.982740"),
        side: "B",
        price: 0.00001,
        counterCcy: 'BTC',
        baseCcy: 'XEM',
        amount: 50000,
        feeCcy: 'XEM',
        fee: 0,
        bonusCcy:'JPY',
        bonus: 0,
        total: 0.5,
      },
    ];

    let [trades, balance] = module.calcProfitAndLoss(input, []);

    expect(trades[0].pl).toEqual({
      amount: 1,
      price: 1000000,
      priceJ: 1000000,
      total: 1000000,
      pl: 0,
      rate: 1,
      balanceBefore: {
        baseCcy: {
          ccy: 'BTC',
          amount: 0,
          priceJ: 0,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: 0,
          priceJ: 0,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'BTC',
          amount: 1,
          priceJ: 1000000,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -1000000,
          priceJ: 1,
        },
      },
    });

    expect(trades[1].pl).toEqual({
      amount: 50000,
      price: 0.00001,
      priceJ: 11,
      total: 0.5,
      pl: 50000,
      rate: 1100000,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 0,
          priceJ: 0,
        },
        counterCcy: {
          ccy: 'BTC',
          amount: 1,
          priceJ: 1000000,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 50000,
          priceJ: 11,
        },
        counterCcy: {
          ccy: 'BTC',
          amount: 0.5,
          priceJ: 1000000,
        },
      },
    });
  });


  it("calculates right pl of the cross trade (sell).", function() {
    const input = [
      {
        tradeDate: new Date("2017-07-25 12:22:10.982740"),
        side: "B",
        price: 10,
        counterCcy: 'JPY',
        baseCcy: 'XEM',
        amount: 10000,
        feeCcy: 'XEM',
        fee: 2000,
        bonusCcy:'JPY',
        bonus: 10,
        total: 100000,
      },
      {
        tradeDate: new Date("2017-07-26 12:22:10.982740"),
        side: "S",
        price: 0.00002,
        counterCcy: 'BTC',
        baseCcy: 'XEM',
        amount: 5000,
        feeCcy: 'BTC',
        fee: 0.001,
        bonusCcy:'JPY',
        bonus: 10,
        total: 0.10,
      },
    ];

    let [trades, balance] = module.calcProfitAndLoss(input, []);

    expect(trades[0].pl).toEqual({
      amount: 8000,
      price: 12.5,
      priceJ: 12.5,
      total: 100000,
      pl: 10,
      rate: 1,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 0,
          priceJ: 0,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: 0,
          priceJ: 0,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 8000,
          priceJ: 12.5,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -100000,
          priceJ: 1,
        },
      },
    });

    expect(trades[1].pl).toEqual({
      amount: 5000,
      price: 0.0000198,
      priceJ: 1515151.5151515151,
      total: 0.099,
      pl: 87510 - 0.001 * 1100000,
      rate: 30,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 8000,
          priceJ: 12.5,
        },
        counterCcy: {
          ccy: 'BTC',
          amount: 0,
          priceJ: 0,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 3000,
          priceJ: 12.5,
        },
        counterCcy: {
          ccy: 'BTC',
          amount: 0.099,
          priceJ: 1515151.5151515151,
        },
      },
    });
  });

  it("calculates right pl of the cross trade (mix).", function() {
    const input = [
      {
        tradeDate: new Date("2017-07-25 12:22:10.982740"),
        side: "B",
        price: 10,
        counterCcy: 'JPY',
        baseCcy: 'XEM',
        amount: 10000,
        feeCcy: 'XEM',
        fee: 2000,
        bonusCcy:'JPY',
        bonus: 0,
        total: 100000,
      },
      {
        tradeDate: new Date("2017-07-26 12:22:10.982740"),
        side: "S",
        price: 0.00002,
        counterCcy: 'BTC',
        baseCcy: 'XEM',
        amount: 5000,
        feeCcy: 'BTC',
        fee: 0,
        bonusCcy:'JPY',
        bonus: 0,
        total: 0.10,
      },
      {
        tradeDate: new Date("2017-07-26 12:22:10.982740"),
        side: "B",
        price: 0.00003,
        counterCcy: 'BTC',
        baseCcy: 'XRP',
        amount: 1000,
        feeCcy: 'XRP',
        fee: 1,
        bonusCcy:'JPY',
        bonus: 0,
        total: 0.03,
      },
    ];

    let [trades, balance] = module.calcProfitAndLoss(input, []);

    expect(trades[0].pl).toEqual({
      amount: 8000,
      price: 12.5,
      priceJ: 12.5,
      total: 100000,
      pl: 0,
      rate: 1,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 0,
          priceJ: 0,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: 0,
          priceJ: 0,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 8000,
          priceJ: 12.5,
        },
        counterCcy: {
          ccy: 'JPY',
          amount: -100000,
          priceJ: 1,
        },
      },
    });

    expect(trades[1].pl).toEqual({
      amount: 5000,
      price: 0.00002,
      priceJ: 1500000,
      total: 0.1,
      pl: 87500,
      rate: 30,
      balanceBefore: {
        baseCcy: {
          ccy: 'XEM',
          amount: 8000,
          priceJ: 12.5,
        },
        counterCcy: {
          ccy: 'BTC',
          amount: 0,
          priceJ: 0,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XEM',
          amount: 3000,
          priceJ: 12.5,
        },
        counterCcy: {
          ccy: 'BTC',
          amount: 0.1,
          priceJ: 1500000,
        },
      },
    });

    expect(trades[2].pl).toEqual({
      amount: 999,
      price: 0.000030030030030030033,
      priceJ: 33.033033033033033,
      total: 0.030000000000000002,
      pl: -12000,
      rate: 1100000,
      balanceBefore: {
        baseCcy: {
          ccy: 'XRP',
          amount: 0,
          priceJ: 0,
        },
        counterCcy: {
          ccy: 'BTC',
          amount: 0.1,
          priceJ: 1500000,
        },
      },
      balanceAfter: {
        baseCcy: {
          ccy: 'XRP',
          amount: 999,
          priceJ: 33.033033033033033,
        },
        counterCcy: {
          ccy: 'BTC',
          amount: 0.07,
          priceJ: 1500000,
        },
      },
    });
  });


});
