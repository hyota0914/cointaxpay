import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AmazonAuth from '../lib/connect-with-aws/AmazonAuth';

class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      signedIn: AmazonAuth.isSignedIn(),
      username: '',
    };
    AmazonAuth.refresh().then(() => {
      this.setState({
        username: AmazonAuth.getUsername(),
      });
    }).catch((e) => {
      console.log(e);
    });
  }

  render() {
    let linkListToApped;
    let key = 0;
    if (this.state.signedIn) {
      linkListToApped = [
        <li key={key++}><Link to="/edit-trades/">取引データ登録・編集</Link></li>,
        <li key={key++}><Link to="/spec/">計算ロジック</Link></li>,
        <li key={key++}><Link to="/account/">アカウント情報</Link></li>,
      ];
    } else {
      linkListToApped = [
        <li key={key++}><Link to="/edit-trades/">取引データ登録・編集</Link></li>,
        <li key={key++}><Link to="/spec/">計算ロジック</Link></li>,
        <li key={key++}><Link to="/signin/">サインイン</Link></li>,
      ];
    }
    return (
      <div className="nav-container">
        <div className="container">
          <div className="row">
            <ul className='inline-list hover-links nav-list twelve columns'>
              <li><Link to="/" className='text-lg'>CoinPL(β)</Link></li>
              {linkListToApped}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Navigation;
