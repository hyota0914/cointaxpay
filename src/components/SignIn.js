import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import AmazonAuth from '../lib/connect-with-aws/AmazonAuth';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleUpdate(e) {
    switch (e.target.name) {
      case 'username':
        this.setState({username: e.target.value});
        break;
      case 'password':
        this.setState({password: e.target.value});
        break;
      default:
    }
  }

  handleSignIn(e) {
    e.preventDefault();
    AmazonAuth.authenticateAmazonCognitoUser(this.state.username, this.state.password)
      .then(() => {
        this.setState({success: true});
      })
      .catch((err) => {
        if (err.message.match(/.*confirmed.*/)) {
          this.setState({notConfirmed: true});
        }
        this.setState({error: err.message});
      });
  }

  render() {
    if (this.state.notConfirmed) {
      return (
        <Redirect to='/signup-confirm/' />
      );
    }
    if (this.state.success) {
      window.location.href = "/";
    }

    return (
      <div className="container">
        <div className="alert">
          サインインしてください。新規登録の場合は<Link to="/signup">こちら</Link>からご登録ください。
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
            <button className="button" onClick={this.handleSignIn.bind(this)}>SignIn!</button>
          </div>
        </form>
      </div>
    );
  }
}

export default SignIn;
