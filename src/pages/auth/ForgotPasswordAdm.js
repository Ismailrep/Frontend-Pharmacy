import React, { useState } from "react";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, PreviewCard } from "../../components/Component";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import { FormGroup, Spinner } from "reactstrap";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../constants/API";

const ForgotPasswordAdm = ({ history }) => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const btnSend = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/admin/forgot-password`, { email });
      setIsLoading(false);
      if (!response.data) return setMsg("Account not found!");
      history.push(`${process.env.PUBLIC_URL}/reset-mail-sent`);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Head title="ForgotPassword" />
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
                <BlockDes>
                  <p>If you forgot your password, well, then we’ll email you instructions to reset your password.</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            <form>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Email
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control form-control-lg"
                    id="default-01"
                    placeholder="Enter your email address"
                  />
                </div>
              </FormGroup>
              <p className="text-center text-danger">{msg}</p>
            </form>
            <div className="form-note-s2 text-center pt-4">
              <Button onClick={btnSend} color="primary" size="lg" className="btn-block">
                {isLoading ? <Spinner size="sm" color="light" /> : "Send Reset Link"}
              </Button>
            </div>
            <div className="form-note-s2 text-center pt-4">
              <Link to={`${process.env.PUBLIC_URL}/adm`}>
                <strong>Return to login</strong>
              </Link>
            </div>
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default ForgotPasswordAdm;
