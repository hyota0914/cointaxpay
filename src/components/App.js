import React from 'react';
import {Route, Switch} from 'react-router-dom';

import './App.css';
import SignUp from './SignUp';
import SignIn from './SignIn';
import SignInCheck from './SignInCheck';
import Account from './Account';
import Landing from './Landing';
import Navigation from './Navigation';
import EditTrades from './EditTrades';
import Spec from './Spec';
import Contribute from './Contribute';
import Security from './Security';

const App = () => {
  return <div>
    <Navigation />
    <div className="main-container">
      <Switch>
        <Route path='/' exact component={Landing} />
        <Route path='/edit-trades' exact component={EditTrades} />
        <Route path='/account' component={Account} />
        <Route path='/signin' component={SignIn} />
        <Route path='/signup' component={SignUp} />
        <Route path='/spec' component={Spec} />
        <Route path='/contribute' component={Contribute} />
        <Route path='/security' component={Security} />
      </Switch>
    </div>
  </div>
}

export default App;
