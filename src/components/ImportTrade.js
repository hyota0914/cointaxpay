import React, { Component } from 'react';
import SelectExchange from './SelectExchange';
import TradeList from './TradeList';
import './App.css';

const EXCHANGES = [
  //{
  //  name: "Binance",
  //  howtoImport: (
  //    <div className="alert">
  //      [How to]<br />
  //      BinanceからTradeHistoryをダウンロードし、内容をコピーして貼り付けてください。<br />
  //      [Format]<br />
  //      Date  Market  Type  Price Amount  Total Fee Fee Coin<br />
  //      * Tab区切り、またはカンマ区切り
  //    </div>
  //  ),
  //},
  {
    name: "Zaif(現物)",
    howtoImport: (
      <div className="alert">
        [How to]<br />
        Zaifからダウンロードした取引履歴CSVの内容をコピーして貼り付けてください。<br />
        [Format]<br />
        "マーケット","取引種別","価格","数量","取引手数料","ボーナス円","日時","コメント"<br />
        * Tab区切り、またはカンマ区切り
      </div>
    ),
  },
  {
    name: "Bitbank",
    howtoImport: (
      <div className="alert">
        [How to]<br />
        Bitbankから取引履歴をダウンロードし、内容をコピーして貼り付けてください。<br />
      </div>
    ),
  },
  {
    name: "Coincheck",
    howtoImport: (
      <div className="alert">
        [How to]<br />
        Coincheckから取引履歴CSVをダウンロードし、内容をコピーして貼り付けてください。<br />
        [Format]<br />
        ID,日付,操作内容,金額,通貨,JPY,BTC,ETH,ETC,DAO,LSK,FCT,XMR,REP,XRP,ZEC,XEM,LTC,DASH,BCH<br />
        * Tab区切り、またはカンマ区切り
      </div>
    ),
  },
];

class ImportTrade extends Component {

  constructor(props) {
    super(props);
    this.state = {
      exchange: null,
      input: '',
      trades: null,
      error: null,
    }
  }

  onSelectExchange(exchange) {
    this.setState({exchange: exchange});
  }

  handleUpdate(e) {
    this.setState({
      input: e.target.value,
      error: null,
    });
    let parser;
    switch(this.state.exchange) {
      case 'Zaif(現物)': {
        parser = require('../lib/parse-zaif-trade-history').parseZaifTradeHistory;
        break;
      }
      case 'Binance': {
        parser = require('../lib/parse-binance-trade-history').parseBinanceTradeHistory;
        break;
      }
      case 'Bitbank': {
        parser = require('../lib/parse-bitbank-trade-history').parseBitbankTradeHistory;
        break;
      }
      case 'Coincheck': {
        parser = require('../lib/parse-coincheck-trade-history').parseCoincheckTradeHistory;
        break;
      }
      default:
        break;
    }
    try {
      let trades = parser(e.target.value) || [];
      const filtered = trades.filter((t) => {
        return String(t['tradeDate'].getFullYear()) === String(this.props.year);
      });
      if (trades.length === 0 && e.target.value) {
        this.setState({error: "有効なデータを入力してください。"});
      } else {
        this.setState({trades: filtered});
      }
    } catch (e) {
      this.setState({error: "有効なデータを入力してください。" + e.message});
    }
  }

  handleCancelImport(e) {
    this.setState({trades: null});
  }

  handleResetExchange(e) {
    this.setState({exchange: null});
  }

  handleImport(e) {
    this.props.onImportTrades(this.state.trades);
  }

  render() {
    if (!this.state.exchange) {
      return (
        <SelectExchange exchanges={EXCHANGES.map((e) => e.name)} onSelectExchange={
          this.onSelectExchange.bind(this)
        } />
      );
    }

    if (!this.state.trades || this.state.trades.length === 0) {
      return (
        <div>
          <div className="row">
            <button className="button float-button" onClick={
              this.handleResetExchange.bind(this)
            }>取引所選択</button>
          </div>
          {EXCHANGES.find(e => e.name === this.state.exchange).howtoImport}
          {this.state.error &&
            <div className="row">
              <div className="red-text">
                {this.state.error}
              </div>
            </div>
          }
          <div className="u-full-width">
            <label>
              取引履歴
              <textarea className="pastearea u-full-width" name="trade-history" defaultValue={this.state.input} onChange={
                this.handleUpdate.bind(this)
              } />
            </label>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="red-text">
            下記{this.state.trades.length}件の取引をインポートしてよろしいですか？
          </div>
        </div>
        <div className="row">
          <button className="button float-button" onClick={
            this.handleCancelImport.bind(this)
          }>修正する</button>
          <button className="button float-button" onClick={
            this.handleImport.bind(this)
          }>インポート</button>
        </div>
        <TradeList data={this.state.trades}/>
      </div>
    );
  }
}

export default ImportTrade;
