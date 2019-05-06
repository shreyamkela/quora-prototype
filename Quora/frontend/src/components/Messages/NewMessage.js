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
import Messages from "../Messages/Messages";

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
            newMessage:"",
            people:[],
            sendTo:"",
            msgList : false
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
            newMessage : "",
            msgList : true            
        });
        
    } ;    

    handleReturn = ()=>{
        this.setState({
            visible: true,
            conversation : false,
            newMessage : "",
            inputValue:""
        });
     //   this.componentWillMount();   //re-mount the component to see updated list of conversations
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
        this.setState({ newMessage: e.target.value });
        console.log("newMessage: "+this.state.newMessage)
    }

    personSelect=(e) =>{
        console.log("Inside Category select");
        this.setState({
            receiverName: e.target.name,
            sendTo: e.target.value
            
        }, () => console.log("Receiver Name: "+this.state.receiverName+" SendTo: "+this.state.sendTo));
        

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

            let person = response.data.map(p => { return {value: p.email, display: p.firstname+" "+p.lastname} });
            console.log("person")
            this.setState({ people: [{value: '', display: '(Select the person you want to message)'}].concat(person) });
            
          
        } catch (error) {
          console.log(error);
          message.error("Unable to search at the moment. Please refresh the page and try again.");
        }
      };



        sendMessage = () =>{
        let response = null;
        let email_id = cookie.load('cookie_user');
        let receiver = this.state.sendTo;
        console.log("email_id: "+cookie.load('cookie_user'));
        console.log("receiver: "+receiver);
        console.log("message: "+this.state.newMessage);
        let data = {
            sender : email_id,
            receiver : this.state.sendTo,
            message : this.state.newMessage
            // receiverName : this.state.receiverName
        }
        try{
        response = API.post("message",data)
        message.success("Message sent successfully!");
        this.setState({ msgList : true });
        
        console.log("this.state.inputValue: "+this.state.inputValue)
        }catch(error){
            message.error("Unable to send message. Please refresh the page.");
        }
    }
                
                
    render(){ 


        return(        
            <div>  
                 {/*TO DISPLAY LIST OF CONVERSATIONS  */}
                {this.state.msgList && <Messages visible="true"/>}
                <Modal
                        title="New Message"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        bodyStyle={{ padding: '0' }}
                        style={{ top: '20' ,bottom:'20'}}
                        width={600}
                        footer={[
                            <Button key="send" onClick={this.sendMessage}>Send</Button>
                          ]}
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
                    <div>
                    
                    &emsp;&emsp;<select onChange={this.personSelect} value={this.state.sendTo} required="true">
                    {this.state.people.map((person) => <option key={person.display} value={person.value}>{person.display}</option>)}
                    </select><br></br><br></br><br></br>
                    &emsp;&emsp;<textarea onChange={this.handleChange}></textarea>
                    </div>
                    </div>
                
                </Modal>
                
        </div>
        )
    }
   
}

export default NewMessages;
