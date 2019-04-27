import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import SignedInRoute from './SignedInRoute';
import './App.css';
import { auth } from './fb';

import Home from "./Home";
import DeptAdd from "./DeptAdd";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

class App extends Component {
  state = { loading: true, currentUser: null, authenticated: false };

  render() {
    if (this.state.loading) {
      return <p>Loading...</p>;
    }

    return (
      <Router>
        <div>
          <PrivateRoute exact path="/" component={Home} authenticated={this.state.authenticated} currentUser={this.state.currentUser}/>
          <PrivateRoute exact path="/addDept" component={DeptAdd} authenticated={this.state.authenticated} currentUser={this.state.currentUser}/>
          <SignedInRoute exact path="/signIn" component={SignIn} authenticated={this.state.authenticated}/>
          <SignedInRoute exact path="/signUp" component={SignUp} authenticated={this.state.authenticated}/>
        </div>
      </Router>
    );
  }

  componentWillMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ currentUser: { uid: user.uid, name: user.displayName }, authenticated: true, loading: false });
      } else {
        this.setState({ currentUser: null, authenticated: false, loading: false});
      }
    });
  }
};

export default App;
