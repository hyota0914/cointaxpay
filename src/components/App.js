import React from 'react';
import {Route, Switch} from 'react-router-dom';

import './App.css';
import SignUp from './SignUp';
import SignOut from './SignOut';
import SignUpConfirm from './SignUpConfirm';
import SignUpSuccess from './SignUpSuccess';
import SignIn from './SignIn';
import SignInCheck from './SignInCheck';
import Landing from './Landing';
import Navigation from './Navigation';
import EditTrades from './EditTrades';

const App = () => {
  return <div>
    <Navigation />
    <div className="main-container container">
      <Switch>
        <Route path='/' exact component={Landing} />
        <Route path='/edit-trades' exact component={EditTrades} />
        <Route path='/signin' component={SignIn} />
        <Route path='/signup' component={SignUp} />
        <Route path='/signout' component={SignOut} />
        <Route path='/signup-confirm' component={SignUpConfirm} />
        <Route path='/signup-success' component={SignUpSuccess} />
      </Switch>
      <Switch>
        <Route path='/import' component={SignInCheck} />
      </Switch>
    </div>
  </div>
}

export default App;
