import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Icon, PreviewCard } from "../../components/Component";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import { Form, FormGroup, Spinner, Alert, Button } from "reactstrap";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { loginAdmin } from "../../redux/actions/admin";
import { Link, Redirect } from "react-router-dom";

const Login = () => {
  const admin = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const [inputData, setInputData] = useState({ email: "", password: "" });

  const inputHandler = (event) => {
    const { name, value } = event.target;

    setInputData({ ...inputData, [name]: value });
  };

  if (admin.id) {
    return <Redirect to={"/admin"} />;
  }

  return (
    <React.Fragment>
      <Head title="Login" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-4 text-center">
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
            </Link>
          </div>

          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4">Admin Sign-In</BlockTitle>
                <BlockDes>{/* <p>Access Dashlite using your email and passcode.</p> */}</BlockDes>
              </BlockContent>
            </BlockHead>
            {errorVal && (
              <div className="mb-3">
                <Alert color="danger" className="alert-icon">
                  {" "}
                  <Icon name="alert-circle" /> Unable to login with credentials{" "}
                </Alert>
              </div>
            )}
            <Form className="is-alter">
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Email
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    id="default-01"
                    name="email"
                    onChange={inputHandler}
                    value={inputData.email}
                    placeholder="Enter your email address"
                    className="form-control-lg form-control"
                  />
                  {admin.errMsg.includes("mail") && <span className="invalid">{admin.errMsg}</span>}
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <Link className="link link-primary link-sm" to={`/adm/forgot-password`}>
                    Forgot Password?
                  </Link>
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>

                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passState ? "text" : "password"}
                    id="password"
                    name="password"
                    onChange={inputHandler}
                    value={inputData.password}
                    placeholder="Enter your password"
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                  />
                  {admin.errMsg.includes("Password") && <span className="invalid">{admin.errMsg}</span>}
                </div>
              </FormGroup>
            </Form>
            <div className="form-note-s2 text-center pt-4">
              <Button
                disabled={admin.isLoading}
                size="lg"
                className="btn-block"
                onClick={() => dispatch(loginAdmin(inputData))}
                color="primary"
              >
                {admin.isLoading ? <Spinner size="sm" color="light" /> : "Sign in"}
              </Button>
            </div>
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};

export default Login;
