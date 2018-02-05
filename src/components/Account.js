import React, { Component } from 'react';

import AmazonAuth from '../lib/connect-with-aws/AmazonAuth';
import EditDataStorage from '../lib/manage-edit-data/EditDataStorage';
import { ScaleLoader } from 'react-spinners';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      emailVerified: "",
      error: null,
      loading: true,
    }
    const err = (e) => {
      console.log(e);
      this.setState({
        error: "エラーが発生しました。:" + e.message,
        loading: false,
      });
    };
    AmazonAuth.refresh().then(() => {
      AmazonAuth.getUserAttributes().then((result) => {
        result.forEach((attr) => {
          if (attr.Name === 'email') {
            this.setState({email: attr.Value});
          }
          if (attr.Name === 'email_verified') {
            this.setState({emailVerified: attr.Value});
          }
        });
        this.setState({
          username: AmazonAuth.getUsername(),
          loading: false,
        });
      }).catch((e) => {
        err(e);
      });
    }).catch((e) => {
      err(e);
    });
  }

  handleSignOut(e) {
    if (!window.confirm(`サインアウトすると保存していないデータは失われます。よろしいですか？`)) {
      return;
    }
    EditDataStorage.clear();
    if (AmazonAuth.isSignedIn()) {
      const ls = require('storage2').sessionStorage;
      ls.clear();
      AmazonAuth.signOut();
      window.location.href = "/";
    }
  }

  render() {
    return (
      <div className="container">
        <div className='sweet-loading loading-center'>
          <ScaleLoader
            color={'#66cc99'}
            loading={this.state.loading}
          />
        </div>
        <div className="row">
          <div className="row">
            <div className="six columns">
              <label>
                ユーザー名
                <input className="u-full-width" type="text" name="username" value={this.state.username} readOnly />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="six columns">
              <label>
                メールアドレス
                <input className="u-full-width" type="text" name="username" value={this.state.email} readOnly />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="six columns">
              <label>
                メールアドレス確認
                <input className="u-full-width" type="text" name="username" value={
                  this.state.emailVerified ? "確認済み" : "未確認"
                } readOnly />
              </label>
            </div>
          </div>
          <button className="button float-button" onClick={
            this.handleSignOut.bind(this)
          }>サインアウト</button>
        </div>
      </div>
    );
  }
}

export default Account;
