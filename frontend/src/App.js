import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';

// --------------------------------------------------
// consts
// --------------------------------------------------
const EXCHANGES = [
  ["binance"  , "Binance"],
  ["zaif"     , "Zaif"   ],
  ["bitbank"  , "bitbank"],
  ["coincheck", "coincheck"],
];

// --------------------------------------------------
// Login
// --------------------------------------------------
class Login extends Component {
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>
              email:&nbsp;
              <input type="text" name="name" />
            </label>
          </div>
          <div>
            <label>
              pass:&nbsp;
              <input type="password" name="password" />
            </label>
          </div>
          <input type="submit" />
        </form>
      </div>
    )
  }
}

// --------------------------------------------------
// Landing
// --------------------------------------------------
class LandingView extends Component {
  render() {
    return (
      <div>
        <div>
          <b>[説明]</b><br />
          各取引所の取引履歴を一括で登録し、税金計算のための損益を自動計算するツールです。<br />
          損益計算は総平均法で行います。<br />
        </div>
        <br />
        <div>
          <b>[注意]</b><br />
          個人開発のため、本アプリの利用は自己責任でお願いいたします。<br />
          仮に本アプリを利用することにより、何らかの損害が生じたとしても一切責任は負えません。<br />
        </div>
        <br />
        <div>
          <b>[お願い事項]</b><br />
          継続的なサービス提供を行うため、少額の寄付または下記リンクでの取引所登録をお願いいたします。<br />
        </div>
        <br />
        <div>
          <b>[取引所登録リンク]</b><br />
          <div>
            Binance<br />
          </div>
          <div>
            Coincheck<br />
          </div>
          <div>
            Bitbank<br />
          </div>
        </div>
        <br />
        <div>
          <b>[寄付先]</b><br />
          <div>
            Ripple<br />
          </div>
          <div>
            Bitcoin<br />
          </div>
          <div>
            ETH<br />
          </div>
          <div>
            MONA<br />
          </div>
        </div>
      </div>

    )
  }
}

// --------------------------------------------------
// Import
// --------------------------------------------------
class ImportView extends Component {

  constructor(props) {
    super(props);
    const querystring = require('querystring');
    this.state = {exchange: querystring.parse(window.location.search.slice(1))['exchange']}
    this.handleChangeHistory = this.handleChangeHistory.bind(this)
  }

  handleChangeHistory(event) {
    let parser;
    switch(this.state.exchange) {
      case 'zaif': {
        parser = require('./lib/parse-zaif-trade-history').parseZaifTradeHistory;
        break;
      }
      case 'binance': {
        parser = require('./lib/parse-binance-trade-history').parseBinanceTradeHistory;
        break;
      }
      case 'bitbank': {
        parser = require('./lib/parse-bitbank-trade-history').parseBitbankTradeHistory;
        break;
      }
      case 'coincheck': {
        parser = require('./lib/parse-coincheck-trade-history').parseCoincheckTradeHistory;
        break;
      }
      default:
        // do nothing
        break;
    }
    try {
      const tradeList = parser(event.target.value);
      console.log(tradeList);
    } catch (e) {
      console.log(e);
      // TODO: handle error
    }
  }

  render() {
    let alertMessage;
    switch (this.state.exchange) {
      case 'zaif':
        alertMessage = (
          <div className="alert">
            [How to]<br />
            WebブラウザでZaifにログインし、取引履歴をコピーして貼り付けてください。<br />
            [Format]<br />
            注文	価格	数量	手数料	ボーナス	日時<br />
            * Tab区切り、またはカンマ区切り
          </div>);
        break;
      case 'binance':
        alertMessage = (
          <div className="alert">
            [How to]<br />
            BinanceからTradeHistoryをダウンロードし、内容をコピーして貼り付けてください。<br />
            [Format]<br />
            Date  Market  Type  Price Amount  Total Fee Fee Coin<br />
            * Tab区切り、またはカンマ区切り
          </div>);
        break;
      case 'coincheck':
        alertMessage = (
          <div className="alert">
            [How to]<br />
            Coincheckから取引履歴CSVをダウンロードし、内容をコピーして貼り付けてください。<br />
            [Format]<br />
            ID,日付,操作内容,金額,通貨,JPY,BTC,ETH,ETC,DAO,LSK,FCT,XMR,REP,XRP,ZEC,XEM,LTC,DASH,BCH<br />
            * Tab区切り、またはカンマ区切り
          </div>);
        break;
      default:
        // do nothing
        break;
    }
    const exchange = EXCHANGES.find(x => { return x[0] === this.state.exchange; });

    return (
      <div>
        <h3>取引一括登録</h3>
        {alertMessage}
        <form>
          <div className="row">
            <div className="three columns">
              <label>
                取引所
                <select className="u-full-width" name="exchange" defaultValue={exchange[0]}>
                  <option value={exchange[0]}>{exchange[1]}</option>
                </select>
              </label>
            </div>
          </div>
          <div className="row">
          </div>
          <div className="u-full-width">
            <label>
              取引履歴
              <textarea className="pastearea u-full-width" name="trade-hist-csv" onChange={this.handleChangeHistory} />
            </label>
          </div>
        </form>
      </div>
    )
  }
}

class SelectExchangeView extends Component {
  render() {
    const exchangeList = EXCHANGES.map(x => {
      return (
        <Link className="button float-button" to={"/import?exchange="+x[0]} key={x[0]}>
          {x[1]}
        </Link>)
    });
    return (
      <div>
        <h3>取引所選択</h3>
        <div className="row">アップロードする取引履歴の取引所を選択してください</div>
        <form>
          {exchangeList}
        </form>
      </div>
    )
  }
}

// --------------------------------------------------
// Common parts
// --------------------------------------------------
class Navigation extends Component {
  render() {
    return (
      <div className="nav-container">
        <div className="container">
          <ul className='inline-list hover-links nav-list six columns'>
            <li><Link to="/" className='text-lg'>Crypttax</Link></li>
            <li><Link to="/history/">取引一覧</Link></li>
            <li><Link to="/select-exchange/">取引一括登録</Link></li>
          </ul>
        </div>
      </div>
    )
  }
}

class Main extends Component {
  render() {
    return (
      <div className="main-container container">
        <Route path='/select-exchange' component={SelectExchangeView} />
        <Route path='/import' component={ImportView} />
        <Route path='/' exact component={LandingView} />
      </div>
    )
  }
}

const App = function() {
  return (
    <div>
      <Navigation />
      <Main />
    </div>
  );
}

export default App;
