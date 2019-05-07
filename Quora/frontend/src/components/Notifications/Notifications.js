import React, {Component} from "react";
import {connect} from "react-redux";
import {Button, Card, Row, Col, message} from "antd";
import cookie from "react-cookies";
import Pagination from 'react-bootstrap/Pagination'
import API from "../../utils/API";

class Notifications extends Component {

    
        state = {
             list: this.props.history.location.state.notifications
         }

    

    async componentWillMount() {

        

    }

    async handleQuestionLinkClick(key,email,notifications,e){
        let response = null;
        const data = {
            qid: key,
            email : email,
            notifications : notifications
        }
        try{
        response = await API.post("notifications",data);
        //message.success("Data updated successfully!");
        this.props.history.push({ // This is how we pass data from this component to a child component i.e searchQuestions, using the history.push.
            // This will change the route, render new component, and also pass data into the component.
            // Passed data can be accessed in the child component through this.props.history.location.state.
            // To pass these props into the child component we have used <Route exact path="/main/questions/search" render={(props) => <SearchQuestions {...props} />} />
            // pathname: `/main/questions/${key.question}/questions`,
            pathname: `/main/${key}`,
            state: {
                selectedQuestion: key
            }
        })
        }
        catch(error){
            message.error("Unable to send message. Please refresh the page.");
        }


        
    }
    render(){
        if(!cookie.load('cookie_user')){
            this.props.history.push("/login");
        }
     console.log("state: "+JSON.stringify(this.state.list));

     let listOfNotifs = this.state.list.map(notif => {
         return(

            <div style={{ textAlign: "center" }}>
            <div className="card" style={{ width: "100%", height: 100, textAlign: "center" }}>
                <div className="card-body">
                <br></br>
                    <h5>You have {notif.notifications} new answer(s) to the question you followed: </h5>
                    <h6 className="card-title" style={{ fontSize: 15, marginLeft: 20, marginTop: 20 }}>
                        <href to="#" onClick= { this.handleQuestionLinkClick.bind(this,notif.qid,cookie.load('cookie_user'),notif.notifications )}><font color="#6495ED"> {notif.question}</font></href>
                    </h6>
                    <br />
                </div>
            </div>
            <br />
            <br />
        </div>

                
            
         )
     })

        return (
            <div>
                <Card>
                    <div>
                        <font size="4">
                            <b>Notifications for you</b>
                        </font>
                        <br />
                        <br />
                        {listOfNotifs}
                    </div>
                    
                </Card>
            </div>
        );
    }
}

export default Notifications;