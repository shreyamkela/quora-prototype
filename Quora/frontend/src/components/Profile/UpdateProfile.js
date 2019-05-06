import React, { Component } from 'react';
import { updateProfile, fetchProfile } from "../../actions";
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import _ from "lodash";


const zipcode = value =>
value && !/^\d{5}(?:[-\s]\d{4})?$/i.test(value) ?
'Invalid Zipcode' : undefined

const state = value =>
value && !/^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/i.test(value) ?
'Invalid State abbreviation' : undefined

class UpdateProfile extends Component {

  constructor() {
    super()
    this.state = {
      user_photo: null
    }

  }
  componentDidMount() {
    //call to action
    this.handleInitialize();
   // this.props.fetchProfile();
    
  }

  handleInitialize() {

let firstname = _.map(this.props.profile, prof => {  return  prof.firstname  }) 
let lastname = _.map(this.props.profile, prof => {  return  prof.lastname  }) 
let email = _.map(this.props.profile, prof => {  return  prof.email  }) 
let city = _.map(this.props.profile, prof => {  return  prof.city  }) 
let state = _.map(this.props.profile, prof => {  return  prof.state  }) 
let zipcode = _.map(this.props.profile, prof => {  return  prof.zipcode  }) 
let education = _.map(this.props.profile, prof => {  return  prof.education  }) 
let career = _.map(this.props.profile, prof => {  return  prof.career  }) 
let aboutme = _.map(this.props.profile, prof => {  return  prof.aboutme  }) 
let credentials = _.map(this.props.profile, prof => {  return  prof.credentials  }) 

    const initData = {
      "firstname": firstname[0],
      "lastname": lastname[0],
      "email": email[0],
      "city": city[0],
      "state": state[0],
      "zipcode": zipcode[0],
      "education": education[0],
      "career": career[0],
      "aboutme": aboutme[0],
      "credentials": credentials[0]
    };

    this.props.initialize(initData);
  }

    renderField(field) {
        const { meta: { touched, error } } = field;
        const className = `form-group ${touched && error ? "has-danger" : ""}`;
    
        return (
          <div className={className}>
            <label>{field.label}</label>
            <input className="form-control" type="text" {...field.input} />
            <div className="text-help">
              {touched ? error : ""}
            </div>
          </div>
        );
      }
      
    onSubmit (values) {

    this.props.updateProfile(values,() => {
        this.props.history.push('/main/profile/'+cookie.load('cookie_user'))
      });
      }

      componentWillReceiveProps(nextProps) {
        if (nextProps.newPost) {
          this.props.posts.unshift(nextProps.newPost);
        }
      }  

    render () {
        const { handleSubmit } = this.props;


        let firstname =  _.map(this.props.profile, prof => {  return  prof.firstname  })
        let lastname =  _.map(this.props.profile, prof => { return  prof.lastname    }) 

        let redirectVar = null;
        if(!cookie.load('cookie_user')){
            redirectVar = <Redirect to= "/login"/>
        }
        return ( 
          <div >
          <div>
              {redirectVar}
              <div  className="login-form">
                  <div style={{ "max-width": "60%"}} className="main-div">
                      <div className="panel">
{firstname} {" "} {lastname}
                      <h1 className="h3 mb-3 font-weight-normal">Profile Update Form</h1>
                      </div>
                    <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                              


        <Field
          name="city"
          label="Your City"
          component={this.renderField}
        />
        <Field
        name="state"
        label="Your State"
        component={this.renderField}
        validate={state}
      />  
      <Field
      name="zipcode"
      label="Your Zipcode"
      component={this.renderField}
      validate={zipcode}
    />
    <Field
    name="education"
    label="Your Education"
    component={this.renderField}
  />
    <Field
      name="career"
      label="Your Career"
      component={this.renderField}
    />
    <Field
    name="aboutme"
    label="About Yourself"
    component={this.renderField}
  />  
  <Field
  name="credentials"
  label="Your Credentials"
  component={this.renderField}
/>  
                   
 <div style={{"padding":"10px"}}>
 <button type="submit" className="add-button" >Submit</button>    
</div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

function validate(values) {

    const errors = {};
  
    // Validate the inputs from 'values'

      if (!values.credentials) {
        errors.credentials = "Please Enter Credentials";
      }
   
   //   if (!values.user_photo) {
   //     errors.user_photo = "Uploda Photo";
   //   }
    // If errors is empty, the form is fine to submit
    // If errors has *any* properties, redux form assumes form is invalid
    return errors;
  }

  function mapStateToProps(state)
    {
     
return{
  rescode: state.status,
  profile: state.profile.items,

} 
}

UpdateProfile = reduxForm({
  validate,
  form: 'ProfileUpdateForm'
})(UpdateProfile)


UpdateProfile = connect(mapStateToProps, { fetchProfile, updateProfile })(UpdateProfile);

export default UpdateProfile;
