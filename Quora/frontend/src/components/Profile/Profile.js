import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchProfile } from "../../actions";
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import { List, Button} from 'antd';
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
        this.props.history.push('/main/profile/updateProfile')
    }
    onSubmit1 (e) {
        e.preventDefault()
        console.log("in onsubmit photo")
        this.props.history.push('/updatePhoto')
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
                         
        const datavalue = [{
          title:  'First Name',
          value: firstname
        }, {
          title:  'Last Name',
          value: lastname
        }, {
          title:  'Email',
          value: email
        },
        {
          title:  'City',
          value: city
        },
        {
          title:  'State',
          value: state
        },
        {
          title:  'Zipcode',
          value: zipcode
        },
        {
          title:  'Education',
          value: education
        },
        {
          title:  'Career',
          value: career
        },
        {
          title:  'About Me',
          value: aboutme
        },
        {
          title:  'Credentials',
          value: credentials
        }
      ]; 
                 
        console.log("profile :" + JSON.stringify((this.props.profile)))
    
            let redirectVar = null;
            if(!cookie.load('cookie_user'))
                redirectVar = <Redirect to= "/login"/>
      return (
        <div>
           
          <List
          itemLayout="horizontal"
          dataSource={datavalue}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                
                title={item.title}
                description={item.value}
              />
            </List.Item>
          )}
        />
        
        <Button  id="btn_space"   onClick={this.onSubmit} className="add-button" type="primary"  style={{"margin-left":"223px"}} >Update Profile</Button>
        <Button onClick={this.onSubmit1} className="add-button" type="primary"   >Upload Photo</Button>
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