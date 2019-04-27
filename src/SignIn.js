import React, { Component } from "react";
import { auth } from './fb';
import firebase from 'firebase/app';
import firebaseui from 'firebaseui';

class SignIn extends Component {
  render() {
    return (
      <div>
        <div id="firebaseui-auth-container"></div>
        <div id="loader">Loading...</div>
      </div>
    );
  }

  componentDidMount() {
    // Initialize the FirebaseUI Widget using Firebase.
    this.ui = new firebaseui.auth.AuthUI(auth);

    const uiConfig = {
      callbacks: {
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';
        }
      },
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID
      ],
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      // Terms of service url.
      tosUrl: '<your-tos-url>',
      // Privacy policy url.
      privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    // The start method will wait until the DOM is loaded.
    this.ui.start('#firebaseui-auth-container', uiConfig);
  }

  componentWillUnmount() {
    this.ui.delete();
  }
}

export default SignIn;
