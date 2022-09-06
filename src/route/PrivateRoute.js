import React from "react";
import { Route, Redirect } from "react-router-dom";

const auth = localStorage.getItem("accessToken");

const PrivateRoute = ({ exact, component: Component, ...rest }) => (
  <Route exact={exact ? true : false} rest render={(props) => <Component {...props} {...rest} />} />
);

export default PrivateRoute;
