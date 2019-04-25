import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchProfile } from "../../actions";
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import _ from "lodash";

class Profile extends Component {
    
    constructor() {
        super()
        this.onSubmit = this.onSubmit.bind(this)
        this.onSubmit1 = this.onSubmit1.bind(this)
    }
    componentWillMount() {
        //call to action
        this.props.fetchProfile();
      }
      componentWillReceiveProps(nextProps) {
        if (nextProps.newPost) {
          this.props.posts.unshift(nextProps.newPost);
        }
      }
      onSubmit (e) {
        e.preventDefault()
        console.log("in onsubmit profile")
        this.props.history.push('/main/updateProfile')
    }
    onSubmit1 (e) {
        e.preventDefault()
        console.log("in onsubmit photo")
        this.props.history.push('/main/updatePhoto')
    }

    render () { 
        let firstname =  _.map(this.props.profile, prof => {  return  prof.firstname  })
        let lastname =  _.map(this.props.profile, prof => { return  prof.lastname    })  
        let email =  _.map(this.props.profile, prof => { return  prof.email   })
        let aboutme =  _.map(this.props.profile, prof => {  return  prof.aboutme})
        let city =  _.map(this.props.profile, prof => {  return  prof.city})
        let state =  _.map(this.props.profile, prof => {  return  prof.state})
        let zipcode =  _.map(this.props.profile, prof => {  return  prof.zipcode})
        let education =  _.map(this.props.profile, prof => {  return  prof.education})
        let career =  _.map(this.props.profile, prof => {  return  prof.career})    
        let credentials =  _.map(this.props.profile, prof => {  return  prof.credentials})         
                         
                 
        console.log("profile :" + JSON.stringify((this.props.profile)))
    
            let redirectVar = null;
            if(!cookie.load('cookie_user'))
                redirectVar = <Redirect to= "/login"/>
        return (
            
            <div>
            {redirectVar}
            <div class="content-wrapper">
            <section className="content-header">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                   
            <button   onClick={this.onSubmit} class="btn btn-primary" style={{"margin-left":"223px"}} type="submit">Update Profile</button>
            <button onClick={this.onSubmit1} class="btn btn-primary" style={{"margin-left":"363px","margin-top":"-54px"}} type="submit">Upload Photo</button>
            <div  className="container">
        
        <table style={{"margin-left":"210px","padding":"5em","width":"500px"}}>
  <tr>
    <th>First Name</th>
    <td>{firstname}</td>
  </tr>
  <tr>
    <th>Last Name</th>
    <td>{lastname}</td>
  </tr>
  <tr>
    <th>Email</th>
    <td>{email}</td>
  </tr>
  <tr>
  <th>City</th>
  <td>{city}</td>
</tr>
<tr>
<th>State</th>
<td>{state}</td>
</tr>
<tr>
<th>Zipcode</th>
<td>{zipcode}</td>
</tr>
<tr>
<th>Education</th>
<td>{education}</td>
</tr>
<tr>
<th>Career</th>
<td>{career}</td>
</tr>
<tr>
<th>About Me</th>
<td>{aboutme}</td>
</tr>
<tr>
<th>Credentials</th>
<td>{credentials}</td>
</tr>


</table>
            
            </div>
            </div>
                    </div>
                    </div>
                    </section>
                    </div>
            
            </div>
        )
        }
}
Profile.propTypes = {
    fetchProfile: PropTypes.func.isRequired,
    profile: PropTypes.array.isRequired
  
  };
  
  const mapStateToProps = state => (
      {
    profile: state.profile.items
  });
  

export default connect(mapStateToProps, { fetchProfile })(Profile);