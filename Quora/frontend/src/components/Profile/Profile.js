import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchProfile } from "../../actions";
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import { List, Button} from 'antd';
import _ from "lodash";
import axios from 'axios';
import API from "../../utils/API";
import { Row, Col, message } from "antd";


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
        this.onSubmit2 = this.onSubmit2.bind(this)
    }
    onChange (e) {
      this.setState({photo: e.target.files[0]});
  }
  async componentWillMount() {
    //call to action
  console.log(this.props.match.params.user_id)

try{
let response = null;
    this.props.fetchProfile(this.props.match.params.user_id);

response = await  API.get('profile/pic/?email_id='+this.props.match.params.user_id)

        console.log("printing response" + JSON.stringify(response.data))
        this.setState({
         user_data : this.state.user_data.concat(response.data),
     });
     console.log("userdata:" + JSON.stringify(this.state.user_data))
  
}
catch (error) {
  console.log(error);
  message.error("Unable to get photo")
}

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
    async onSubmit (e) {

      try{
        let response = null;
  
        const formData = new FormData();
        formData.append('photo', this.state.photo);
    
    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    };
    e.preventDefault()
    response = await API.post("profile/pic",formData,config);
  
   // axios.post(`${ROOT_URL}/profile/pic`,formData,config)
   // .then((response) => {
        alert("The photo is successfully uploaded");
        console.log("printing response" + JSON.stringify(response))
   
        window.location.reload()
    //  this.props.history.push('/main/profile')
      }
      catch(err)  {
          console.log(err)
      }
      }


      async onSubmit2 (e) {

        try{
          let response = null;
    
      
      e.preventDefault()
      response = await API.post("profile/delete");
    
     // axios.post(`${ROOT_URL}/profile/pic`,formData,config)
     // .then((response) => {
          alert("Your account is being deleted");
          console.log("printing delete response" + JSON.stringify(response))
          cookie.remove('cookie_user', { path: '/' })
          cookie.remove('auth_token', { path: '/' })
        //this.props.history.push('/login')
        window.location.reload();
        }
        catch(err)  {
            console.log(err)
        }
        }




        async handleFollow(email) {
          console.log(email)
  
          try {
            let data = { my_email : cookie.load("cookie_user"), target_email : email }
            console.log(data);
            // GET topicsFollowed backend route is being used here to follow if not already followed. GET topicsFollowed backend route is being used in the Topics.js frontend to GET all topics followed by this user. They type property in data determines which frontend component is calling /topicsFollowed 
            let response = null;
            response = await API.post("follow", data);
            console.log("Response on follow: "+JSON.stringify(response))
            if(!response.data.success && response.data.already){
              message.error("Person Already Followed!")
            } else if(response.data.success && !response.data.already){
              message.success("Person Followed!")
            } else {
              message.error("Unable to follow person at the moment. Please refresh the page and try again.")
            }
          } catch (error) {
            console.log(error);
            message.error("Unable to follow person at the moment. Please refresh the page and try again.")
          }
      
        }
      
        async handleUnfollow(email) {
          console.log(email)
          try {
            let data = { my_email: cookie.load("cookie_user"), target_email : email }
            let response = null;
            response = await API.post("unfollow", data);
            console.log("Response on unfollow: "+JSON.stringify(response))
            if(!response.data.success && response.data.already){
              message.error("Not Following Person. Can't Unfollow!")
            } else if(response.data.success && !response.data.already){
              message.success("Person Unfollowed!")
            } else {
              message.error("Unable to unfollow person at the moment. Please refresh the page and try again.")
            }
          } catch (error) {
            console.log(error);
            message.error("Unable to unfollow person at the moment. Please refresh the page and try again.")
          }
      
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
      let deleteAccountButton = null
      let followUnfollow = null
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
        deleteAccountButton=<Button   onClick={this.onSubmit2} className="add-button" type="primary"  >Delete Account</Button>
        } else {
          followUnfollow = <Col style={{ marginLeft: 205 }}>
          <Row span={3}>
            <Button size="small" icon="check-circle" shape="round" onClick={() => this.handleFollow(this.props.match.params.user_id)} >
              Follow
            </Button>
          </Row>
          <Row span={3}>
            <Button size="small" icon="close-circle" shape="round" onClick={() => this.handleUnfollow(this.props.match.params.user_id)}>
              Unfollow
            </Button>
          </Row>
        </Col>
        }
      return (
        <div>
        {redirectVar}

        <div style={{"width":"100%"}}>
        <div  style={{"float":"left","width":"50%"}} >
     <h2  className="h3 mb-3 font-weight-normal">{firstname} {" "} {lastname}
     </h2>
           <div  className="pull-left image">
           {followUnfollow}
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
        
        {deleteAccountButton}
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