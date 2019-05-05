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
import NewMessage from './NewMessage';

import moment from 'moment';

class Messages extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            visible : this.props.visible,
            messageList: [],
            inputValue : "",
            newMessage:"",
            composeNew : ""
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
    
    async componentWillMount(){
        let response = null;
        let email_id = cookie.load('cookie_user');
        console.log("email_id: "+cookie.load('cookie_user'))
        try{
        response = await API.get("message",{params : {email_id:email_id}})
        //console.log("Response.data messages:  "+JSON.stringify(response.data));
        this.setState({ messageList: response.data });
        }catch(error){
            console.log(error.response);
            message.error("Unable to show followed topics. Please refresh the page.");
        }
    }

    

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

    newMessageHandler = (e) => {
        
        this.setState({composeNew: true}) ;
        console.log("clicked new message. composeNew: "+this.state.composeNew);
    }



    async sendMessage(receiver,newMessage,e){
        let response = null;
        let email_id = cookie.load('cookie_user');
        console.log("email_id: "+cookie.load('cookie_user'))
        let data = {
            sender : email_id,
            receiver : receiver,
            message : newMessage
        }
        try{
        response = await API.post("message",data)
        message.success("Message sent successfully!");
        this.setState({ newMessage: "" });
        
        console.log("this.state.inputValue: "+this.state.inputValue)
        }catch(error){
            message.error("Unable to send message. Please refresh the page.");
        }
    }
                
                
    render(){ 

        if(this.state.visible==false && this.state.conversation==false){
            this.props.history.push("/login");
        }

        let conversationList = this.state.messageList.map(conv => {
            let noChats = conv.chat.length;
            console.log("no of mesgs: "+noChats);
            var date= moment(conv.chat[noChats-1].time).format('MMMM Do YYYY');
            return(
                
                <tr onClick = {this.viewConv.bind(this, conv)}>
                    <td>
                        <p><b>{conv.chatWith}</b>&emsp;&emsp;<h6>{date}</h6></p>
                        <p>{conv.chat[noChats-1].message}</p>
                    </td>
                    
                </tr>
                
                
            )
            
        })


        return(        
            <div>  
                 {/*TO DISPLAY LIST OF CONVERSATIONS  */}
                 {this.state.composeNew && <NewMessage visible={true}/>}
                <Modal
                        title="Messages"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        bodyStyle={{ padding: '0' }}
                        style={{ top: '20' ,bottom:'20'}}
                        width={600}
                        footer={[
                            <Button key="back" onClick={this.newMessageHandler}>New Message</Button>,
                          ]}
                >
                    <div class="scroller">
                    <table class="table">
                        {conversationList}
                    </table>
                    </div>
                
                </Modal>
                {/* TO DISPLAY CHAT MESSAGES */}
                <Modal
                        
                        title={this.chatWith}
                        visible={this.state.conversation}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        bodyStyle={{ padding: '0' }}
                        style={{ top: '20' ,bottom:'20'}}
                        width={600}
                        footer={[
                            <input type="text" name="newMessage" style={{ width: "500px" ,height:"40px"}} onChange = {this.handleChange} value = {this.state.newMessage} placeholder="Type your message here"></input>,<br></br>,
                            <Button key="back" onClick={this.handleReturn}>Return</Button>,
                            <Button key="submit" type="primary" onClick={this.sendMessage.bind(this,this.chatWith,this.state.newMessage)}>
                              Send
                            </Button>
                          ]}
                >
                    <div class="scroller">
                    <table class="table">
                        {this.chatMessages}
                    </table>
                    </div>
                
                </Modal>
                }
        </div>
        )
    }
   
}

export default Messages;
