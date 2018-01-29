import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import AmazonAuth from '../lib/connect-with-aws/AmazonAuth';

class SignUpConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: AmazonAuth.getUsername(),
      code: '',
      resendSuccessNotice: '',
      error: '',
    };
  }

  handleUpdate(e) {
    switch (e.target.name) {
      case 'username':
        this.setState({username: e.target.value});
        break;
      case 'code':
        this.setState({code: e.target.value});
        break;
      default:
    }
    this.setState({resendSuccessNotice: null});
  }

  handleConfirm(e) {
    e.preventDefault();
    this.setState({resendSuccessNotice: null});
    AmazonAuth.confirmAmazonCognitoUser(this.state.username, this.state.code)
      .then(() => {
        this.setState({isConfirmed: true});
      })
      .catch((err) => {
        this.setState({error: err.message});
      });
  }

  handleResend(e) {
    e.preventDefault();
    AmazonAuth.resendConfirmationCode(this.state.username)
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
                <input className="u-full-width" type="text" name="username" defaultValue={this.state.username} onChange={this.handleUpdate.bind(this)} />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="three columns">
              <label>
                確認コード
                <input className="u-full-width" type="number" name="code" onChange={this.handleUpdate.bind(this)} />
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
            <button className="button" onClick={this.handleConfirm.bind(this)}>Confirm!</button>
          </div>
          {this.state.resendSuccessNotice &&
            <div className="row">
              <div className="green-text">
                {this.state.resendSuccessNotice}
              </div>
            </div>
          }
          <div className="row">
            <button className="button" onClick={this.handleResend.bind(this)}>確認コード再送</button>
          </div>
        </form>
      </div>
    );
  }
}

export default SignUpConfirm;
