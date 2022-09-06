import React, { useState } from "react";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import { Spinner, FormGroup } from "reactstrap";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
// <<<<<<< HEAD
// <<<<<<< Updated upstream:src/pages/auth/Register.js
// =======
import axios from "axios";
// >>>>>>> Stashed changes:src/pages/auth/Register.jsx
// =======
import axios from "axios";
// >>>>>>> d79a407d232ef0d6995861548d3e34d0330d7445

const Register = ({ history }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passState, setPassState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const { errors, register, handleSubmit } = useForm();

  const Register = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:2000/users/register", {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        password: password,
      });
      history.push(`${process.env.PUBLIC_URL}/auth-success`);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <React.Fragment>
      <Head title="Register" />
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
                <BlockTitle tag="h4">Register</BlockTitle>
                <BlockDes>
                  <p>Create New Ramu Account</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            <form className="is-alter" onSubmit={Register}>
              <FormGroup>
                <label className="form-label" htmlFor="firstName">
                  First Name
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    ref={register({ required: true })}
                    className="form-control-lg form-control"
                    required
                  />
                  {errors.firstName && <p className="invalid">This field is required</p>}
                </div>
              </FormGroup>
              <FormGroup>
                <label className="form-label" htmlFor="lastName">
                  Last Name
                </label>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    ref={register({ required: true })}
                    className="form-control-lg form-control"
                    required
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Email
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bssize="lg"
                    id="default-01"
                    name="email"
                    ref={register({ required: true })}
                    className="form-control-lg form-control"
                    placeholder="Enter a valid email address"
                    required
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
                    title="Please insert a valid email address"
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="default-01">
                    Phone Number
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    bssize="lg"
                    id="default-01"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    ref={register({ required: true })}
                    className="form-control-lg form-control"
                    placeholder="Enter your phone number"
                    required
                    pattern="(\+62 ((\d{3}([ -]\d{3,})([- ]\d{4,})?)|(\d+)))|(\(\d+\) \d+)|\d{3}( \d+)+|(\d+[ -]\d+)|\d+"
                    title="Please insert a valid phone number"
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                    Password
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
                    id="password"
                    name="passcode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    ref={register({ required: "This field is required" })}
                    placeholder="Enter your password"
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                    required
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*+`~'=?\|\]\[\(\)\-<>/]).{8,}"
                    title="Requires number, symbol, uppercase and lowercase letter. At least 8 or more characters"
                  />
                </div>
              </FormGroup>
              <p className="text-center text-danger">{msg}</p>
              <FormGroup>
                <Button type="submit" color="primary" size="lg" className="btn-block">
                  {loading ? <Spinner size="sm" color="light" /> : "Register"}
                </Button>
              </FormGroup>
            </form>
            <div className="form-note-s2 text-center pt-4">
              {" "}
              Already have an account?{" "}
              <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                <strong>Sign in instead</strong>
              </Link>
            </div>
            <div className="text-center pt-4 pb-3">
              <h6 className="overline-title overline-title-sap">
                <span>OR</span>
              </h6>
            </div>
            <ul className="nav justify-center gx-8">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Facebook
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#socials"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  Google
                </a>
              </li>
            </ul>
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Register;
