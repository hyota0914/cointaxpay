import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

import AmazonAuth from '../lib/connect-with-aws/AmazonAuth';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      error: '',
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
    AmazonAuth.signUpToAmazonCognitoUserPool(this.state.username, this.state.email, this.state.password)
      .then((cognitoUser) => {
        this.setState({user: cognitoUser});
      }).catch((err) => {
        console.log(err.message);
        this.setState({error: err.message});
      });
  }

  render() {
    if (this.state.user !== undefined) {
      return (
        <Redirect to='/signup-confirm' />
      );
    }

    return (
      <div className="container">
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
