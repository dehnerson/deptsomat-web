import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function SignedInRoute({
  component: Component,
  authenticated,
  ...rest
}) {
  return (
    <Route {...rest} render={props => authenticated === false ? (<Component {...props} {...rest} />) : (<Redirect to="/" />)}/>
  );
}
