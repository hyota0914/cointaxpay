import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

import AmazonAuth from '../lib/connect-with-aws/AmazonAuth';

class SignUpSuccess extends Component {
  render() {
    if (!AmazonAuth.isLoggedIn()) {
      return (
        <Redirect to='/signin' />
      );
    }
    return (
      <div className="container">
        <div className="row">
          こんにちは、{AmazonAuth.getUsername()}さん！
        </div>
        <div className="row">
          取引履歴を<Link to="/select-exchange/">登録</Link>してください。
        </div>
      </div>
    );
  }
}

export default SignUpSuccess;
