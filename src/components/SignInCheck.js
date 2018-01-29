import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import AmazonAuth from '../lib/connect-with-aws/AmazonAuth.js';

class SignInCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    AmazonAuth.refresh()
      .then(() => {
        console.log("User logged in");
      })
      .catch((err) => {
        console.log(err);
        this.setState({authError: true});
      });
  }
  
  render() {
    if (this.state.authError) {
      return <Redirect to='/signin' />;
    } else {
      return (null);
    }
  }
}

export default SignInCheck;
