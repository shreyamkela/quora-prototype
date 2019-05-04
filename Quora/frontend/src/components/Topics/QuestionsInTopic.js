import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { Button, Card, Row, Col, message, Pagination } from "antd";
import API from "../../utils/API";

class QuestionsInTopic extends Component {
    state = {
        questions: "",
        pagenumber: 1
    }

    componentDidMount = async () => {
        if (this.props.history.location.state !== undefined) {
            let topicId = this.props.history.location.state.selectedTopic._id;
            try {
                let data = { topicId: topicId }
                let response = null;
                response = await API.get("questionsInTopic", { params: data });
                this.setState({ questions: response.data })
            } catch (error) {
                console.log(error);
                message.error("Unable to fetch questions at the moment. Please refresh the page.")
            }
        }
    }

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

    handleQuestionLinkClick = (key) => {
        this.props.history.push({ // This is how we pass data from this component to a child component i.e searchQuestions, using the history.push. This will change the route, render new component, and also pass data into the component. Passed data can be accessed in the child component through this.props.history.location.state. To pass these props into the child component we have used <Route exact path="/main/questions/search" render={(props) => <SearchQuestions {...props} />} />
            pathname: `/main/${key._id}`,
            state: {
                selectedQuestion: key
            }
        }) // TODO - Complete the page `/main/${key._id}`
    }

    handlePageNumberClick = e => {
        console.log("Page number changed!", e);
        this.setState({ pagenumber: e });
    };

    render() {
        //console.log("QuestionsInTopic component: ", this.props.history.location.state);
        let title = null;
        let topic = null;
        if (this.props.history.location.state !== undefined) {
            title = this.props.history.location.state.selectedTopic.title;
            topic = this.props.history.location.state.selectedTopic;
        }

        let displayedResults = null;
        if (this.state.questions === "" || this.state.questions.includes("No questions")) {
            displayedResults = <div style={{ textAlign: "center", fontSize: 15 }}>No questions have been added to this topic yet. Be the first to add one!</div>;
        } else {

            var pagination = null;
            let allQuestions = null;
            let pageQuestions = []; // questions to show on this page number

            let pageNumbers = Math.floor(this.state.questions.length / 5) + 1;
            pagination = <Pagination defaultPageSize={1} defaultCurrent={1} total={pageNumbers} onChange={this.handlePageNumberClick} />;
            allQuestions = this.state.questions;
            let thisPageLast = this.state.pagenumber * 5;
            for (var i = thisPageLast - 5; i < thisPageLast; i++) {
                if (allQuestions[i] !== undefined) {
                    pageQuestions[i] = allQuestions[i];
                }
            }



            displayedResults = pageQuestions.map(key => (
                <div style={{ textAlign: "center" }}>
                    <div className="card" style={{ width: "70%", height: "auto", textAlign: "center" }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ fontSize: 15, marginLeft: 20, marginTop: 20 }}>
                                <href to="#" onClick={() => { this.handleQuestionLinkClick(key) }}><font color="#6495ED">{key.question}</font></href>
                            </h5>
                            <br />

                        </div>
                    </div>
                    <br />
                    <br />
                </div>
            ));
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
                    {displayedResults}
                    <br />
                    <br />
                    <div style={{ textAlign: "center" }}>{pagination}</div>
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
