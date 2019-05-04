import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchProfile } from "../../actions";
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import { List, Button} from 'antd';
import _ from "lodash";
import axios from 'axios';

const ROOT_URL = "http://localhost:3001";

class Profile extends Component {
    
    constructor() {
        super()
        this.state = {
          user_data: [],
          photo:null
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onSubmit1 = this.onSubmit1.bind(this)
    }
    onChange (e) {
      this.setState({photo: e.target.files[0]});
  }
    componentWillMount() {
        //call to action
      console.log(this.props.match.params.user_id)
        this.props.fetchProfile(this.props.match.params.user_id);
        axios.get(`${ROOT_URL}/profile/pic/?email_id=`+this.props.match.params.user_id)
        .then((response) => {
          //  alert("The file is successfully uploaded");
            console.log("printing response" + JSON.stringify(response.data))
            this.setState({
             user_data : this.state.user_data.concat(response.data),
         });
         console.log("userdata:" + JSON.stringify(this.state.user_data))
      })
          .catch(err => {
              console.log(err)
          })
      }
      componentWillReceiveProps(nextProps) {
        if (nextProps.newPost) {
          this.props.posts.unshift(nextProps.newPost);
        }
      }
      onSubmit1 (e) {
        e.preventDefault()
        console.log("in onsubmit profile")
        this.props.history.push('/main/profile/updateProfile')
    }
    onSubmit (e) {
      const formData = new FormData();
      formData.append('photo', this.state.photo);
  
  const config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
  };
  e.preventDefault()
  axios.post(`${ROOT_URL}/profile/pic`,formData,config)
  .then((response) => {
      alert("The photo is successfully uploaded");
      console.log("printing response" + JSON.stringify(response))
 
      window.location.reload()
  //  this.props.history.push('/main/profile')
})
    .catch(err => {
        console.log(err)
    })
    }

    render () { 
      
      let pic =  this.state.user_data.map(data => {
        return  data.photo
         })

  console.log("pic path" + pic)
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
              redirectVar = <Redirect to="/login" />
      let UploadImageForm = null
      let updateProfileButton = null
      if (cookie.load('cookie_user') === this.props.match.params.user_id)
      {
        UploadImageForm= <form   style={{"margin-top":"180px"}}  noValidate onSubmit={this.onSubmit}>
        <Button variant="contained"
              label='My Label'>
              <input type="file" name="common_name" onChange = {this.onChange}/>
            </Button> <br></br>
            <Button  style={{"margin-right":"10px"}} onClick={this.onSubmit} className="add-button" type="primary"   >Upload Photo</Button>
        </form>
        updateProfileButton=<Button  id="btn_space"   onClick={this.onSubmit1} className="add-button" type="primary"  >Update Profile</Button>
        }
      return (
        <div>
        {redirectVar}

        <div style={{"width":"100%"}}>
        <div  style={{"float":"left","width":"50%"}} >
     <h2  className="h3 mb-3 font-weight-normal">{firstname} {" "} {lastname}</h2>
           <div  className="pull-left image">
           <img src={pic}  alt="" width="200" height="200"  /> 
         </div>   
        {UploadImageForm}
   </div> 
  
   <div  style={{"float":"right","width":"50%"}} >

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
        
        {updateProfileButton}
      

        </div>
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