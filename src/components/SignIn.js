import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';

import AmazonAuth from '../lib/connect-with-aws/AmazonAuth';
import SignUpConfirm from './SignUpConfirm';

class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      username: '',
      password: '',
      needMailAddressConfirmed: false,
      loading: false,
      signinSuccess: require('querystring').parse(
        window.location.search.slice(1))['signin-success'] === 'true',
    };
  }

  handleUpdate(e) {
    switch (e.target.name) {
      case 'username':
        this.setState({username: e.target.value});
        break;
      case 'password':
        this.setState({password: e.target.value});
        break;
      default:
    }
    this.setState({
      error: '',
    });
  }

  handleSignIn(e) {
    e.preventDefault();
    this.setState({loading: true});
    AmazonAuth.authenticateAmazonCognitoUser(this.state.username, this.state.password)
      .then(() => {
        window.location.href = "/?succeed-signin=true";
      })
      .catch((err) => {
        if (err.message.match(/.*confirmed.*/)) {
          this.setState({
            error: '',
            needMailAddressConfirmed: true,
          });
        } else {
          this.setState({
            error: "認証に失敗しました。ユーザ名、パスワードをご確認ください。",
            loading: false,
          });
        }
      });
  }

  onMailAddressConfirmed() {
    window.location.href = "/?succeed-signup=true";
  }

  render() {
    if (this.state.needMailAddressConfirmed) {
      return (
        <SignUpConfirm onMailAddressConfirmed={
          this.onMailAddressConfirmed.bind(this)
        } username={this.state.username} />
      );
    }
    if (this.state.signinSuccess) {
      let hello = AmazonAuth.getUsername() ? `こんにちは、${AmazonAuth.getUsername()}さん！` :
        "こんにちは！";
      return (
        <div className="container">
          <div className="alert">
            {hello}<br />
            <Link to="/edit-trades/">こちら</Link>から取引履歴を登録してください。
          </div>
        </div>
      )
    }
    return (
      <div className="container">
        <div className='sweet-loading loading-center'>
          <ScaleLoader
            color={'#66cc99'}
            loading={this.state.loading}
          />
        </div>
        <div className="alert">
          サインインしてください。新規登録の場合は<Link to="/signup">こちら</Link>からご登録ください。
        </div>
        <form>
          <div className="row">
            <div className="six columns">
              <label>
                ユーザー名
                <input className="u-full-width" type="text" name="username" onChange={this.handleUpdate.bind(this)} />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="six columns">
              <label>
                パスワード
                <input className="u-full-width" type="password" name="password" onChange={this.handleUpdate.bind(this)} />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="red-text">
              {this.state.error}
            </div>
          </div>
          <div className="row">
            <button className="button" onClick={this.handleSignIn.bind(this)}>SignIn!</button>
          </div>
        </form>
      </div>
    );
  }
}

export default SignIn;
