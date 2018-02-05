import React, { Component } from 'react';

import AmazonAuth from '../lib/connect-with-aws/AmazonAuth';

class SignUpConfirm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      success: '',
      error: '',
      code: '',
      loading: false,
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
    this.setState({
      success: '',
      error: '',
    });
  }

  handleConfirm(e) {
    e.preventDefault();
    this.setState({loading: true});
    AmazonAuth.confirmAmazonCognitoUser(this.props.username, this.state.code)
      .then(() => {
        this.props.onMailAddressConfirmed();
      })
      .catch((err) => {
        this.setState({
          error: "確認に失敗しました。コードを再度お確かめください。",
          loading: false,
        });
      });
  }

  handleResend(e) {
    e.preventDefault();
    this.setState({loading: true});
    AmazonAuth.resendConfirmationCode(this.state.username)
      .then(() => {
        this.setState({
          resendSuccess: "確認コードを再送しました！",
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({
          error: "再送に失敗しました。",
          loading: false,
        });
      });
  }

  render() {
    return (
      <div className="container">
        <div className="alert">
          確認のため、メールで送信された確認コード６桁を入力してください
        </div>
        <form>
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
          {this.state.resendSuccess &&
            <div className="row">
              <div className="green-text">
                {this.state.resendSuccess}
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
