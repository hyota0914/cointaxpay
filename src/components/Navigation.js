import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AmazonAuth from '../lib/connect-with-aws/AmazonAuth';

class Navigation extends Component {

  constructor(props) {
    super(props);
    let signedIn = false;
    if (AmazonAuth.isSignedIn()) {
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
        <li key="0"><Link to="/edit-trades/">取引データ登録・編集</Link></li>,
        <li key="1"><Link to="/signout/">サインアウト</Link></li>,
      ];
    } else {
      linkListToApped = [
        <li key="0"><Link to="/signin/">サインイン</Link></li>,
        <li key="1"><Link to="/signup/">新規登録</Link></li>,
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

export default Navigation;
