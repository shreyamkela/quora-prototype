import React, {Component} from 'react'
import {Card} from 'antd';
import {connect} from 'react-redux';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { List, Button} from 'antd';
import _ from "lodash";
import { fetchUserActivity } from "../../actions";
import axios from 'axios';
import API from "../../utils/API";

const {Meta} = Card;

const ROOT_URL = "http://localhost:3001";

class UserContent extends Component {

    constructor() {
        super()
        this.state = {
          activities: []
      //    type: '',
       //   timestamp: '',
        //  question_id: ''
        }
        this.onChange = this.onChange.bind(this)
  
   
    }
    onChange (e) {
      this.setState({photo: e.target.files[0]});
  }

  componentWillMount() {
    console.log("Did Mount")
    this.props.fetchUserActivity()

    console.log("activites :" + JSON.stringify((this.props.userActivities)))

    this.setState({
        activities:_.map(this.props.userActivities, activity => {
            return {
                type: activity.type,
                question: activity.question,
                timestamp: activity.timestamp
            }
        })
    })

  }
   

 

    render() {
        if(!cookie.load('cookie_user')){
            this.props.history.push("/login");
        }

        console.log("activity array: " + this.state.activities)
        

let details = [];
details = this.state.activities.map(act => {

    return({
        type:  act.type,
            question: act.question,
            timestamp: act.timestamp
     } )
    })

    console.log("details array: " + JSON.stringify(details))
                          

              let redirectVar = null;
              if(!cookie.load('cookie_user'))
                redirectVar = <Redirect to="/login" />
   

        return (
            <div>
            {redirectVar}

            <div style={{"width":"100%"}}>
       
      
       <div  >
    
              <List
              itemLayout="horizontal"
              dataSource={details}
              renderItem={item => (
                <List.Item>
                {item.type} <b>{item.question}</b>
                  <List.Item.Meta
                    
                    description= {item.timestamp}
                    
                  />
                 
                </List.Item>
              )}
            />
          
    
            </div>
            </div>
              </div>
        )
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return {
        userActivities: state.userActivities
    };
  }
export default connect(mapStateToProps,{fetchUserActivity})(UserContent);