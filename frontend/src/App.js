import React, { Component } from 'react';
import {Route, Link, Redirect } from 'react-router-dom';
import './App.css';
import User from './User.js';

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
// SignUp
// --------------------------------------------------
class SignUpView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
    };
  }

  handleChangeUsername(e) {
    this.setState({username: e.target.value});
  }

  handleChangeEmail(e) {
    this.setState({email: e.target.value});
  }

  handleChangePassword(e) {
    this.setState({password: e.target.value});
  }

  handleClickedSignUp(e) {
    e.preventDefault();
    User.signUpToAmazonCognitoUserPool(this.state.username, this.state.email, this.state.password)
      .then((cognitoUser) => {
        console.log(cognitoUser);
        this.setState({user: cognitoUser});
      }).catch((err) => {
        this.setState({error: err.message});
      });
  }

  render() {
    if (this.state.user !== undefined) {
      return (
        <Redirect to='/signup-confirm' />
      );
    }

    return (
      <div className="container">
        <form>
          <div className="row">
            <div className="six columns">
              <label>
                ユーザー名
                <input className="u-full-width" type="text" name="userName" value={this.state.username} onChange={this.handleChangeUsername.bind(this)} />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="six columns">
              <label>
                メールアドレス
                <input className="u-full-width" type="text" name="email" value={this.state.email} onChange={this.handleChangeEmail.bind(this)} />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="six columns">
              <label>
                パスワード
                <input className="u-full-width" type="password" name="password" value={this.state.password} onChange={this.handleChangePassword.bind(this)} />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="error-message">
              {this.state.error}
            </div>
          </div>
          <div className="row">
            <button className="button" onClick={this.handleClickedSignUp.bind(this)}>SignUp!</button>
          </div>
        </form>
      </div>
    );
  }
}

class SignOutView extends Component {
  constructor(props) {
    super(props);
    if (User.isSignedIn()) {
      User.signOut();
      window.location.href = "/";
    }
  }

  render() {
    return (
      <div className="container">
        <div className="success-message">
          サインアウト中です。
        </div>
      </div>
    )
  }
}


class SignUpConfirmView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: User.getUsername(),
      code: "",
    };
  }

  handleChangeUsername(e) {
    this.setState({
      username: e.target.value,
      resendSuccessNotice: null,
    });
  }

  handleChangeCode(e) {
    this.setState({
      code: e.target.value,
      resendSuccessNotice: null,
    });
  }

  handleClickedConfirm(e) {
    e.preventDefault();
    this.setState({resendSuccessNotice: null});
    User.confirmAmazonCognitoUser(this.state.username, this.state.code)
      .then(() => {
        this.setState({isConfirmed: true});
      })
      .catch((err) => {
        this.setState({error: err.message});
      });
  }

  handleClickedResend(e) {
    e.preventDefault();
    User.resendConfirmationCode(this.state.username)
      .then(() => {
        this.setState({resendSuccessNotice: "確認コードを再送しました！"});
      })
      .catch((err) => {
        this.setState({error: err.message});
      });
  }

  render() {
    if (this.state.isConfirmed) {
      return (
        <Redirect to='/signin' />
      );
    }
    const resendSuccessNotice = this.state.resendSuccessNotice;
    return (
      <div className="container">
        <div className="alert">
          確認のため、メールで送信された確認コード６桁を入力してください
        </div>
        <form>
          <div className="row">
            <div className="six columns">
              <label>
                ユーザー名
                <input className="u-full-width" type="text" name="userName" value={this.state.username} onChange={this.handleChangeUsername.bind(this)} />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="three columns">
              <label>
                確認コード
                <input className="u-full-width" type="number" name="userName" value={this.state.code} onChange={this.handleChangeCode.bind(this)} />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="error-message">
              {this.state.error}
            </div>
          </div>
          <div className="row">
            <button className="button" onClick={this.handleClickedConfirm.bind(this)}>Confirm!</button>
          </div>
          <div className="row">
            <div className="success-message">
              {resendSuccessNotice}
            </div>
          </div>
          <div className="row">
            <button className="button" onClick={this.handleClickedResend.bind(this)}>確認コード再送</button>
          </div>
        </form>
      </div>
    );
  }
}

class SignUpSuccessView extends Component {
  render() {
    if (!User.isLoggedIn()) {
      return (
        <Redirect to='/signin' />
      );
    }
    return (
      <div className="container">
        <div className="row">
          こんにちは、{User.getUsername()}さん！
        </div>
        <div className="row">
          取引履歴を<Link to="/select-exchange/">登録</Link>してください。
        </div>
      </div>
    );
  }
}

// --------------------------------------------------
// SignIn
// --------------------------------------------------
class SignInView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleChangeUsername(e) {
    this.setState({username: e.target.value});
  }

  handleChangePassword(e) {
    this.setState({password: e.target.value});
  }

  handleClickedSignIn(e) {
    e.preventDefault();
    User.authenticateAmazonCognitoUser(this.state.username, this.state.password)
      .then(() => {
        this.setState({success: true});
      })
      .catch((err) => {
        if (err.message.match(/.*confirmed.*/)) {
          this.setState({notConfirmed: true});
        }
        this.setState({error: err.message});
      });
  }

  render() {
    if (this.state.notConfirmed) {
      return (
        <Redirect to='/signup-confirm/' />
      );
    }
    if (this.state.success) {
      window.location.href = "/";
    }

    return (
      <div className="container">
        <div className="alert">
          サインインしてください。新規登録の場合は<Link to="/signup">こちら</Link>からご登録ください。
        </div>
        <form>
          <div className="row">
            <div className="six columns">
              <label>
                ユーザー名
                <input className="u-full-width" type="text" name="userName" value={this.state.username} onChange={this.handleChangeUsername.bind(this)} />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="six columns">
              <label>
                パスワード
                <input className="u-full-width" type="password" name="password" value={this.state.password} onChange={this.handleChangePassword.bind(this)} />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="error-message">
              {this.state.error}
            </div>
          </div>
          <div className="row">
            <button className="button" onClick={this.handleClickedSignIn.bind(this)}>SignIn!</button>
          </div>
        </form>
      </div>
    );
  }
}

// --------------------------------------------------
// Landing
// --------------------------------------------------
class LandingView extends Component {
  render() {
    return (
      <div className="container">
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
    User.refresh()
      .then(() => {
        console.log("User logged in");
      })
      .catch((err) => {
        console.log(err);
        this.setState({authError: true});
      });
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
    if (this.state.authError) {
      return (
        <Redirect to='/signin/' />
      );
    }

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
      <div className="container">
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
              <textarea className="pastearea u-full-width" name="trade-hist-csv" onChange={this.handleChangeHistory.bind(this)} />
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
      <div className="container">
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
  constructor(props) {
    super(props);
    let signedIn = false;
    if (User.isSignedIn()) {
      signedIn = true;
    }
    this.state = {
      signedIn: signedIn,
    };
  }

  render() {
    let linkListToApped;
    if (this.state.signedIn) {
      linkListToApped = [
        <li key="1"><Link to="/select-exchange/">取引一括登録</Link></li>,
        <li key="2"><Link to="/history/">取引一覧</Link></li>,
        <li key="3"><Link to="/signout/">サインアウト</Link></li>,
      ];
    } else {
      linkListToApped = [
        <li key="1"><Link to="/signin/">サインイン</Link></li>,
        <li key="2"><Link to="/signup/">新規登録</Link></li>,
      ];
    }

    return (
      <div className="nav-container">
        <div className="container">
          <ul className='inline-list hover-links nav-list twelve columns'>
            <li><Link to="/" className='text-lg'>Cointaxpay</Link></li>
            {linkListToApped}
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
        <Route path='/signin' component={SignInView} />
        <Route path='/signup' component={SignUpView} />
        <Route path='/signout' component={SignOutView} />
        <Route path='/signup-confirm' component={SignUpConfirmView} />
        <Route path='/signup-success' component={SignUpSuccessView} />
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
