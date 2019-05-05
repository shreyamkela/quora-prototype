import API from "../../utils/API";
import { connect } from "react-redux";
import { logout } from "../../actions";
import cookie from "react-cookies";
import {Modal, Button} from 'antd';
import { Router, Route, Switch } from "react-router-dom";

import React, { Component } from "react";
import { Input, Layout, Menu, Select, message } from "antd";
import { Link } from "react-router-dom";
import {Redirect} from 'react-router';
import moment from 'moment';
const Search = Input.Search;
const Option = Select.Option;

class NewMessages extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            visible : this.props.visible,
            messageList: [],
            inputValue : "",
            newMessage:""
        }
        console.log("visible: "+this.state.visible);
        var chatWith = "";
        var chatMessages = "";
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
            conversation : false,
            newMessage : ""
        });
        //this.props.history.push("/login");
    } ;    

    handleReturn = ()=>{
        this.setState({
            visible: true,
            conversation : false,
            newMessage : "",
            inputValue:""
        });
        this.componentWillMount();   //re-mount the component to see updated list of conversations
    }
    
    // async componentWillMount(){
    //     let response = null;
    //     let email_id = cookie.load('cookie_user');
    //     console.log("email_id: "+cookie.load('cookie_user'))
    //     try{
    //     response = await API.get("message",{params : {email_id:email_id}})
    //     //console.log("Response.data messages:  "+JSON.stringify(response.data));
    //     this.setState({ messageList: response.data });
    //     }catch(error){
    //         console.log(error.response);
    //         message.error("Unable to show followed topics. Please refresh the page.");
    //     }
    // }

    

    viewConv=(conv,e) =>
    {
        console.log("chats: "+JSON.stringify(conv.chat));
        this.setState({conversation :true})
        console.log("state conversation: "+this.state.conversation)
        this.chatWith = conv.chatWith;
        this.chatMessages = conv.chat.map(cm => {
            let noChats = cm.length;
            console.log("no of mesgs: "+noChats);
            var date= moment(cm.time).format('MMMM Do YYYY, h:mm a');
            return(
                
                <tr>
                    <td>
                        <p><b>{cm.sender}</b><h6>{date}</h6></p>
                        <p>{cm.message}</p>
                    </td>
                    
                </tr>
                
                
            )
            
        })

    }
    handleChange = (e) => {
        //TO HANDLE MULTIPLE CHANGES
        this.setState({ [e.target.name]: e.target.value });
        console.log("newMessage: "+this.state.newMessage)
    }

    handleSearch = async searchTerm => {
        // console.log(searchTerm);
    
    
        // TODO - Handle special character/scripts entered in the search bar at the backend so that the server doesnt crash when the entered term is unusual. Check how quora handles special characters or unusual search terms
        try {
          // Query backend api respective to the search type
            let response = null;
            if (searchTerm === "*") {
              searchTerm = "";
            }
            response = await API.get("searchPeople", { params: searchTerm });
            console.log("Search results: ", response.data);
            this.props.history.push({
              pathname: "/main/people/search",
              state: {
                searchResults: response.data
              }
            })
          
        } catch (error) {
          console.log(error);
          message.error("Unable to search at the moment. Please refresh the page and try again.");
        }
      };



    // async sendMessage(receiver,newMessage,e){
    //     let response = null;
    //     let email_id = cookie.load('cookie_user');
    //     console.log("email_id: "+cookie.load('cookie_user'))
    //     let data = {
    //         sender : email_id,
    //         receiver : receiver,
    //         message : newMessage
    //     }
    //     try{
    //     response = await API.post("message",data)
    //     message.success("Message sent successfully!");
    //     this.setState({ newMessage: "" });
        
    //     console.log("this.state.inputValue: "+this.state.inputValue)
    //     }catch(error){
    //         message.error("Unable to send message. Please refresh the page.");
    //     }
    // }
                
                
    render(){ 


        return(        
            <div>  
                 {/*TO DISPLAY LIST OF CONVERSATIONS  */}
                <Modal
                        title="New Message"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        bodyStyle={{ padding: '0' }}
                        style={{ top: '20' ,bottom:'20'}}
                        width={600}
                        // height={800}
                >
                    <div class="scroller">
                    <Search
                        style={{ marginTop: 18 }}
                        placeholder="Search Person"
                        enterButton="Search"
                        size="medium"
                        onSearch={value => {
                            this.handleSearch(value);
                        }}
                    />

                    </div>
                
                </Modal>
                }
        </div>
        )
    }
   
}

export default NewMessages;
