import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';

import AmazonAuth from '../lib/connect-with-aws/AmazonAuth';
import SignUpConfirm from './SignUpConfirm';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      error: '',
      needMailAddressConfirmed: false,
      loading: false,
    };
  }

  handleUpdate(e) {
    switch (e.target.name) {
      case 'username':
        this.setState({username: e.target.value});
        break;
      case 'email':
        this.setState({email: e.target.value});
        break;
      case 'password':
        this.setState({password: e.target.value});
        break;
      default:
    }
  }

  handleClickedSignUp(e) {
    e.preventDefault();
    if (!this.state.username) {
      this.setState({error: "ユーザ名を入力してください。"});
      return;
    }
    if (!this.state.email || this.state.email.trim().length === 0) {
      this.setState({error: "メールアドレスを入力してください。"});
      return;
    }
    if (!this.state.password) {
      this.setState({error: "パスワードを入力してください。"});
      return;
    }
    this.setState({loading: true});
    AmazonAuth.signUpToAmazonCognitoUserPool(this.state.username, this.state.email, this.state.password)
      .then((cognitoUser) => {
        this.setState({
          user: cognitoUser,
          needMailAddressConfirmed: true,
        });
      }).catch((err) => {
        console.log(err.message);
        let errorMessage = "";
        if (err.message.match(/.*User already exists.*/)) {
          errorMessage = "すでに登録済みのユーザ名です。";
        } else if (err.message.match(/.*Invalid email address format.*/)) {
          errorMessage = "メールアドレスの形式をご確認ください。";
        } else if (err.message.match(/.*Member must have length greater than or equal to 6.*/)) {
          errorMessage = "パスワードを６文字以上で入力してください。";
        } else {
          errorMessage = "サインアップに失敗しました。";
        }
        this.setState({
          error: errorMessage,
          loading: false,
        });
      });
  }

  onMailAddressConfirmed() {
    AmazonAuth.authenticateAmazonCognitoUser(this.state.username, this.state.password)
      .then(() => {
        window.location.href = "/signin?signin-success=true";
      })
      .catch((err) => {
        console.log(err);
        window.location.href = "/signin";
      });
  }

  render() {
    if (this.state.needMailAddressConfirmed) {
      return (
        <SignUpConfirm onMailAddressConfirmed={
          this.onMailAddressConfirmed.bind(this)
        } username={this.state.username} />
      );
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
          必要項目を入力し、アカウントを作成してください。すでにアカウントをお持ちの場合は、<Link to="/signin">こちら</Link>からサインインしてください。
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
                メールアドレス
                <input className="u-full-width" type="text" name="email" onChange={this.handleUpdate.bind(this)} />
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
          {this.state.error &&
            <div className="row">
              <div className="red-text">
                {this.state.error}
              </div>
            </div>
          }
          <div className="row">
            <button className="button" onClick={this.handleClickedSignUp.bind(this)}>SignUp!</button>
          </div>
        </form>
      </div>
    );
  }
}

export default SignUp;
