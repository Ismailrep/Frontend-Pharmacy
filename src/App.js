import { React, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Switch, Route, withRouter } from "react-router-dom";
import { RedirectAs404 } from "./utils/Utils";
import PrivateRoute from "./route/PrivateRoute";

import Layout from "./layout/Index";

import Error404Classic from "./pages/error/404-classic";
import Error404Modern from "./pages/error/404-modern";
import Error504Modern from "./pages/error/504-modern";
import Error504Classic from "./pages/error/504-classic";

import Faq from "./pages/others/Faq";
import Terms from "./pages/others/Terms";

import Login from "./pages/auth/Login";
import LoginAdm from "./pages/auth/LoginAdm";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Success from "./pages/auth/Success";
import InvoicePrint from "./pages/pre-built/invoice/InvoicePrint";
import { adminKeepLogin, checkStorage } from "./redux/actions/admin";
import { Spinner } from "reactstrap";
import VerifiedAdm from "./pages/auth/VerifiedAdm";

const App = () => {
  const admin = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("adminAccess");
    if (token) {
      // const userData = JSON.parse(userLocalStorage);
      dispatch(adminKeepLogin(token));
    } else {
      dispatch(checkStorage());
    }
  }, []);

  if (admin.storageIsChecked) {
    return (
      <Switch>
        {/* Auth Pages */}
        <Route exact path={`/auth-success`} component={Success}></Route>
        <Route exact path={`/auth-reset`} component={ForgotPassword}></Route>
        <Route exact path={`/auth-register`} component={Register}></Route>
        <Route exact path={`/adm`} component={LoginAdm}></Route>
        <Route exact path={`/auth-login`} component={Login}></Route>

        {/* Print Pages */}
        <Route exact path={`/invoice-print/:id`} component={InvoicePrint}></Route>

        {/* Helper pages */}
        <Route exact path={`/auths/terms`} component={Terms}></Route>
        <Route exact path={`/auths/faq`} component={Faq}></Route>

        <Route exact path={`/invoice-print`} component={InvoicePrint}></Route>

        {/*Error Pages*/}
        <Route exact path={`/errors/404-classic`} component={Error404Classic}></Route>
        <Route exact path={`/errors/504-modern`} component={Error504Modern}></Route>
        <Route exact path={`/errors/404-modern`} component={Error404Modern}></Route>
        <Route exact path={`/errors/504-classic`} component={Error504Classic}></Route>

        <Route exact path={`/admin-verification/:token`} component={VerifiedAdm}></Route>

        {/*Main Routes*/}
        <PrivateRoute exact path="" component={Layout}></PrivateRoute>
        <Route component={RedirectAs404}></Route>
      </Switch>
    );
  }

  return (
    <div className="container text-center mt-5">
      <Spinner size="lg" color="dark" />;
    </div>
  );
};
export default withRouter(App);
