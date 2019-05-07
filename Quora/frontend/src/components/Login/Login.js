import React, { Component } from "react";
import "../../App.css";
import cookie from "react-cookies";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { checkValid, fetchProfile } from "../../actions";

import quoraLogo from "../../utils/documents/images/quora_logo_light.jpg";

//Define a Login Component
class Login extends Component {
  //Define component that you want to render
  renderField(field) {
    const {
      meta: { touched, error }
    } = field;
    const className = `form-group ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <input className="form-control" type={field.type} {...field.input} placeholder={field.label} />
        <div className="text-help">{touched ? error : ""}</div>
      </div>
    );
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.login_msg !== this.props.login_msg;
  }

  onSubmit(values) {
    console.log(values);
    this.props.checkValid(values, () => {
      if (cookie.load("cookie_user")) {
        this.props.history.push("/main/home");
      }
    });
  }

  render() {
    const { handleSubmit } = this.props;
    //redirect based on successful login
    if (this.props.authFlag) {
      this.props.history.push("/main/home");
    }
    return (
      <div>
        <div className="container">
          <div className="login-form " style={{ marginTop: "8%" }}>
            <div className="main-div ">
              <div className="panel ">
                <div>
                  <img src={quoraLogo} style={{ width: 100 }} />
                </div>
                <br />
                <br />
                <div style={{ textAlign: "center" }}>
                  <div >Please enter your username and password</div>
                  <div id="msg"><font color="#B92b27"><b>{this.props.login_msg}</b></font></div></div>
              </div>
              <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <Field label="User ID" name="email_id" type="text" component={this.renderField} />

                <Field label="Password" name="password" type="password" component={this.renderField} />
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>
              <br />
              <br />
              <a href="/signup">Sign Up</a> if not already registered
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  // Validate the inputs from 'values'
  if (!values.user_id) {
    errors.user_id = "Enter an User ID";
  }
  if (!values.password) {
    errors.password = "Enter password";
  }
  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
}

function mapStateToProps(state) {
  return {
    login_msg: state.login_msg,
    authFlag: state.authFlag
  };
}

export default reduxForm({
  validate,
  form: "LoginForm"
})(
  connect(
    mapStateToProps,
    { checkValid, fetchProfile }
  )(Login)
);
