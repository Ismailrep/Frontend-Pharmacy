import React from "react";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle } from "../../components/Component";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <React.Fragment>
      <Head title="Success" />
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
{/* <<<<<<< HEAD */}
              {/* <<<<<<< Updated upstream */}
              <BlockTitle tag="h4">Thank you for submitting form</BlockTitle>
              <BlockDes className="text-success">
                <p>You can now sign in with your new password</p>
              </BlockDes>
              {/* ======= */}
              <BlockTitle tag="h4">Thank you for registering your Ramu account</BlockTitle>
              <BlockDes className="">
                <p>Please check your e-mail for verification before you log in</p></BlockDes>
                {/* >>>>>>> Stashed changes */}
{/* ======= */}
              <BlockTitle tag="h4">Thank you for registering your Ramu account</BlockTitle>
              <BlockDes className="">
                <p>Please check your e-mail for verification before you log in</p>
{/* >>>>>>> d79a407d232ef0d6995861548d3e34d0330d7445 */}
              </BlockDes>
            </BlockContent>
          </BlockHead>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Success;
