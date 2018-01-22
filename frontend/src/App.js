import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';

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
          <b>[お願い事項その１]</b><br />
          本アプリのサーバ費用は個人で負担しております。<br />
          継続的なサービス提供を行うため、少額の寄付または下記リンクでの取引所登録をお願いいたします。<br />
          週に数日、機能追加や改善を行なっていくためのモチベーションにもなります！(^ ^)<br />
          なお、本アプリはオープンソースです(github)。<br />
          随時PullRequestおよびIssue報告をお待ちしております。<br />
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

    // specify format
    const querystring = require('querystring');
    let format = querystring.parse(window.location.search.slice(1))['format'];
    this.state = {format: format}

    this.handleChangeFormat = this.handleChangeFormat.bind(this)
    this.handleChangeHistory = this.handleChangeHistory.bind(this)
  }

  parseTradeHistory() {
    console.log(this.state);
    let data = this.state.history;
    if (!data) {
      return;
    }
    if (this.state.format === 'zaif') {
      let f = require('./lib/cryptcoin-trade-parser').parseZaifData;
      let ret = f(data);
    }
    else if (this.state.format === 'binance') {
      let f = require('./lib/cryptcoin-trade-parser').parseBinanceData;
      let ret = f(data);
    }
    else if (this.state.format === 'bitbank') {
      let f = require('./lib/cryptcoin-trade-parser').parseBitbankData;
      let ret = f(data);
    }
    else if (this.state.format === 'coincheck') {
      let f = require('./lib/cryptcoin-trade-parser').parseCoincheckData;
      let ret = f(data);
    }
  }

  handleChangeHistory(event) {
    let data = event.target.value;
    this.setState({history: data});
    setTimeout(() => {
      this.parseTradeHistory();
    }, 100);
  }

  handleChangeFormat(event) {
    this.setState({format: event.target.value});
  }

  render() {
    let format = formats.find((x) => { return x[0] === this.state.format });
    let alertMessage;
    let appendForm;

    if (format[0] === 'zaif') {
      alertMessage = (
        <div className="alert">
          [How to]<br />
          WebブラウザでZaifにログインし、取引履歴をコピーして貼り付けてください。<br />
          [Format]<br />
          注文	価格	数量	手数料	ボーナス	日時<br />
          * Tab区切り、またはカンマ区切り
        </div>);
    }
    else if (format[0] === 'binance') {
      alertMessage = (
        <div className="alert">
          [How to]<br />
          BinanceからTradeHistoryをダウンロードし、内容をコピーして貼り付けてください。<br />
          [Format]<br />
          Date  Market  Type  Price Amount  Total Fee Fee Coin<br />
          * Tab区切り、またはカンマ区切り
        </div>);
    }
    else if (format[0] === 'coincheck') {
      alertMessage = (
        <div className="alert">
          [How to]<br />
          Coincheckから取引履歴CSVをダウンロードし、内容をコピーして貼り付けてください。<br />
          [Format]<br />
          ID,日付,操作内容,金額,通貨,JPY,BTC,ETH,ETC,DAO,LSK,FCT,XMR,REP,XRP,ZEC,XEM,LTC,DASH,BCH<br />
          * Tab区切り、またはカンマ区切り
        </div>);
    }

    return (
      <div>
        <h3>取引一括登録</h3>
        {alertMessage}
        <form>
          <div className="row">
            <div className="six columns">
              <label>
                フォーマット
                <select className="u-full-width" name="format" defaultValue={format[0]} onChange={this.handleChangeFormat}>
                  <option value={format[0]}>{format[1]}</option>
                </select>
              </label>
            </div>
            <div className="six columns">
              <label>
                取引所
                <input className="u-full-width" type="text" name="exchange-name" defaultValue={format[1]} />
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

let formats = [
  ["binance"  , "Binance"],
  ["zaif"     , "Zaif"   ],
  ["bitbank"  , "bitbank"],
  ["coincheck", "coincheck"],
];

class SelectFormatView extends Component {
  render() {
    let exchangeList = formats.map((x) => {
      return (
        <Link className="button float-button" to={"/import?format="+x[0]} key={x[0]}>
          {x[1]}
        </Link>)
    });
    return (
      <div>
        <h3>取引履歴フォーマット選択</h3>
        <div className="row">アップロードする取引履歴のフォーマットを選択してください</div>
        <form>
          {exchangeList}
        </form>
      </div>
    )
  }
}

// --------------------------------------------------
// Navigation
// --------------------------------------------------
class Navigation extends Component {
  render() {
    return (
      <div className="nav-container">
        <div className="container">
          <ul className='inline-list hover-links nav-list six columns'>
            <li><Link to="/" className='text-lg'>Crypttax</Link></li>
            <li><Link to="/history/">取引一覧</Link></li>
            <li><Link to="/select-format/">取引一括登録</Link></li>
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
        <Route path='/select-format' component={SelectFormatView} />
        <Route path='/import' component={ImportView} />
        <Route path='/' exact component={LandingView} />
      </div>
    )
  }
}

const App = () => {
  return (
    <div>
      <Navigation />
      <Main />
    </div>
  );
}

export default App;
