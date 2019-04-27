import React, { Component } from "react";
import { auth } from './fb';
import { Grid, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class SignUp extends Component {
  state = {
    email: '',
    emailValidationState: null,
    password: '',
    passwordValidationState: null
  }

  render() {
    return (
      <Grid>
        <Form>
          <FormGroup controlId="inputEmail" validationState={this.state.emailValidationState} bsSize='large'>
            <ControlLabel>Email</ControlLabel>
            <FormControl type="email" placeholder="hans.wurst@example.com" value={this.state.email} onChange={this.changeAndValidate}/>
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup controlId="inputPassword" validationState={this.state.passwordValidationState} bsSize='large'>
            <ControlLabel>Password</ControlLabel>
            <FormControl type="password" value={this.state.password} onChange={this.changeAndValidate}/>
            <FormControl.Feedback />
          </FormGroup>

          <Button type='submit' onClick={this.handleSignUp}>Sign Up</Button>
        </Form>
      </Grid>
    );
  }

  changeAndValidate = (event) => {
    let value, validationState;

    switch(event.target.id) {
      case 'inputEmail':
        value = 'email';
        validationState = 'emailValidationState';
        break;
      case 'inputPassword':
        value = 'password';
        validationState = 'passwordValidationState';
        break;
      default:
        return;
    }

    let obj = {};

    obj[value] = event.target.value;

    if(!event.target.value) {
      obj[validationState] = 'error';
    }
    else {
      obj[validationState] = null;
    }

    this.setState(obj);
  }

  handleSignUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(this.state.email, this.state.password).catch(error => {
      alert(error);
    });
  }
}

export default SignUp;
