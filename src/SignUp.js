import React, { Component } from "react";
import { auth } from './fb';

class SignUp extends Component {
  render() {
    return (
      <div>
        <h1>Sign up</h1>
        <form onSubmit={this.handleSignUp}>
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

  handleSignUp = (event) => {
    event.preventDefault();

    const { email, password } = event.target.elements;

    try {
      auth.createUserWithEmailAndPassword(email.value, password.value);
      this.props.history.push("/");
    } catch (error) {
      alert(error);
    }
  }
}

export default SignUp;
