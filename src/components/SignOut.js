import React, { Component } from 'react';

import AmazonAuth from '../lib/connect-with-aws/AmazonAuth';

class SignOut extends Component {
  constructor(props) {
    super(props);
    if (AmazonAuth.isSignedIn()) {
      AmazonAuth.signOut();
      window.location.href = "/";
    }
  }

  render() {
    return (
      <div className="container">
        <div>
          サインアウト中です。
        </div>
      </div>
    )
  }
}

export default SignOut;
