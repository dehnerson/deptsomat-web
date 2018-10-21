import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import { auth } from './fb';

import Home from "./Home";
import Login from "./Login";
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
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
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
