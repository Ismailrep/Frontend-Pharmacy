import React, { useEffect, useState } from "react";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, PreviewCard } from "../../components/Component";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import { FormGroup, Button } from "reactstrap";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { Link, useParams } from "react-router-dom";
import { Icon } from "../../components/Component";
import { useDispatch } from "react-redux";
import axios from "axios";
import { API_URL } from "../../constants/API";

const ResetPasswordAdm = ({ history }) => {
  const { token } = useParams();
  const [tokenIsValid, setTokenIsValid] = useState(true);
  const [passState, setPassState] = useState(false);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const validPassword = pattern.test(password);

  // CHECK TOKEN EXPIRED
  const authToken = async () => {
    try {
      await axios.post(
        `${API_URL}/admin/auth-reset-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTokenIsValid(true);
    } catch (error) {
      if (error.response.data === "User not authenticated!") {
        setTokenIsValid(false);
      }
      console.log(error);
    }
  };

  const ResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/admin/reset-password`, { password, token });
      history.push(`${process.env.PUBLIC_URL}/reset-password-success`);
    } catch (error) {
      // if (error.response.data.msg) {
      //   setMsg(error.response.data.msg);
      //   setIsLoading(false);
      // }
      console.log(error);
      setIsLoading(false);
    }
  };

  // HANDLE INVALID PASSWORD
  useEffect(() => {
    if (!validPassword && password) {
      setMsg("Min 8 char. included uppercase & lowercase letter, number, and symbol.");
    } else {
      setMsg("");
    }
  }, [validPassword, password]);

  useEffect(() => {
    if (password && !msg) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [password, msg]);

  useEffect(() => {
    authToken();
  }, []);

  return (
    <React.Fragment>
      <Head title="ResetPassword" />
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
                <BlockTitle tag="h5">Reset password</BlockTitle>
                {tokenIsValid ? (
                  <BlockDes>
                    <p>
                      Please insert your new password. Make sure it contains number, symbol, uppercase and lowercase
                      letter. At least 8 or more characters
                    </p>
                  </BlockDes>
                ) : (
                  <span style={{ color: "red" }} className="form-label">
                    Link expired.
                  </span>
                )}
              </BlockContent>
            </BlockHead>
            {tokenIsValid && (
              <>
                <FormGroup>
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      New Password
                    </label>
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                      // title="Requires number, symbol, uppercase and lowercase letter. At least 8 or more characters"
                    />
                    {msg && <span className="invalid">{msg}</span>}
                  </div>
                </FormGroup>
                {/* <div className="form-note-s2 text-center pt-4"> */}
                <Button
                  disabled={!isComplete || isLoading}
                  onClick={ResetPassword}
                  color="primary"
                  size="lg"
                  className="btn-block"
                >
                  {isLoading ? <Spinner size="sm" color="light" /> : "Confirm New Password"}
                </Button>
                {/* </div> */}
              </>
            )}
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default ResetPasswordAdm;
