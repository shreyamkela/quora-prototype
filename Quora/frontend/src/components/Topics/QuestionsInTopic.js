import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { Button, Card, Row, Col, message } from "antd";
import API from "../../utils/API";

class QuestionsInTopic extends Component {

    async handleFollow(topic) {
        try {
            let data = { email: cookie.load("cookie_user"), type: 2, topicId: topic._id }
            // GET topicsFollowed backend route is being used here to follow if not already followed. GET topicsFollowed backend route is being used in the Topics.js frontend to GET all topics followed by this user. They type property in data determines which frontend component is calling /topicsFollowed 
            let response = null;
            response = await API.get("topicsFollowed", { params: data });
            if (response.data.toLowerCase().includes("already")) {
                message.warning("Topic already followed!")
            } else {
                message.success("Topic followed!")
            }
        } catch (error) {
            console.log(error);
            message.error("Unable to follow topic at the moment. Please refresh the page and try again.")
        }

    }

    async handleUnfollow(topic) {
        try {
            let data = { email: cookie.load("cookie_user"), topicId: topic._id }
            let response = null;
            response = await API.post("topicsUnfollowed", data);
            if (response.data.toLowerCase().includes("already")) {
                message.warning("Topic is not followed!")
            } else {
                message.success("Topic Unfollowed!")
            }
        } catch (error) {
            console.log(error);
            message.error("Unable to unfollow topic at the moment. Please refresh the page and try again.")
        }

    }


    render() {
        //console.log("QuestionsInTopic component: ", this.props.history.location.state);
        let title = null;
        let topic = null;
        if (this.props.history.location.state !== undefined) {
            title = this.props.history.location.state.selectedTopic.title;
            topic = this.props.history.location.state.selectedTopic;
        }
        return (
            <div>
                <Card>
                    <div style={{ textAlign: "center" }}>
                        <font size="4">
                            <b>{title}</b>&nbsp;&nbsp;
                        </font>
                        <Button
                            size="small"
                            icon="check-circle"
                            shape="round"
                            onClick={() => this.handleFollow(topic)}

                        >
                            Follow
            </Button>&nbsp;&nbsp;
                        <Button
                            size="small"
                            icon="close-circle"
                            shape="round"
                            onClick={() => this.handleUnfollow(topic)}
                        >
                            Unfollow
            </Button>

                    </div>

                    <br />
                    <br />
                </Card>
            </div>
        );
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return;
}
export default connect(mapStateToProps)(QuestionsInTopic);
