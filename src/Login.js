import React, { Component } from "react";
import { auth } from './fb';

class Login extends Component {
  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleLogin}>
          <label>Email
            <input name="email" type="email" placeholder="Email"/>
          </label>
          <label>Password
            <input name="password" type="password" placeholder="Password"/>
          </label>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  }

  handleLogin = (event) => {
    event.preventDefault();

    const { email, password } = event.target.elements;

    try {
      auth.signInWithEmailAndPassword(email.value, password.value);
      this.props.history.push("/");
    } catch (error) {
      alert(error);
    }
  }
}

export default Login;
