import React from "react";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle } from "../../components/Component";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { Link } from "react-router-dom";
import { Button } from "../../components/Component";

const FailedLogin = () => {
  const user = JSON.parse(window.localStorage.getItem("profile"));
  const delUser = localStorage.removeItem("profile");
  return (
    <React.Fragment>
      <Head title="Failed" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body">
          <div className="brand-logo pb-5">
            <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
              <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
              <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
            </Link>
          </div>
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4">Log In Failed!</BlockTitle>
              <BlockDes className="">
                <p>
                  {!user.is_verified
                    ? "You haven't verified your account yet. Please check your e-mail for verification before you log in"
                    : !user.active_status
                    ? "Your account has been deactivated"
                    : ""}
                </p>
              </BlockDes>
              <Link onClick={delUser} to={`${process.env.PUBLIC_URL}/`}>
                <Button color="primary" size="lg" className="mt-2">
                  Back To Home
                </Button>
              </Link>
            </BlockContent>
          </BlockHead>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default FailedLogin;
