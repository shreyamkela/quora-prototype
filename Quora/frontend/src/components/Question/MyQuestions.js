import React, {Component} from "react";
import {connect} from "react-redux";
import {Button, Card, Row, Col, message} from "antd";
import cookie from "react-cookies";
import Pagination from 'react-bootstrap/Pagination'
import API from "../../utils/API";



class MyQuestions extends Component {


    async fetchMyQuestions(key) {
        //console.log(key)
        try {
            let data = { email: cookie.load("cookie_user"),  questionId: key }
            let response = null;
            response = await API.get("fetchQuestions", { params: data });
            if (response.data.toLowerCase().includes(null)) {
                message.warning("No question added")
            } else {
                message.success("You have added Questions: ")
            }
        } catch (error) {
            console.log(error);
            message.error("Unablefetch your Questions. Please refresh the page and try again.")
        }

    }

    render(){
        return(
            <div>

            </div>
        )
    }
}


//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return;
}
export default connect(mapStateToProps)(MyQuestions);