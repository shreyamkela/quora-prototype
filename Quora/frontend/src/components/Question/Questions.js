import React, { Component } from 'react'
import { Modal, Button, Icon, Card, Comment, Avatar, Form, List, Input, AutoComplete, Select, message, Pagination } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { displayAddAnswerForm, fetchAnswersByQID, fetchProfile } from "../../actions";
import { addQuestion } from "../../actions";
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import _ from "lodash";
import API from "../../utils/API";

const gridStyle = {
    width: '90%',
    textAlign: 'center',
}
const { Meta } = Card;

const TextArea = Input.TextArea;

const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
);

const Editor = ({
    onChange, onSubmit, submitting, value,
}) => (
        <div>
            <Form.Item>
                <TextArea rows={4} onChange={onChange} value={value} />
            </Form.Item>
            <Form.Item>
                <Button
                    htmlType="submit"
                    loading={submitting}
                    onClick={onSubmit}
                    type="primary"
                >
                    Add Comment
            </Button>
            </Form.Item>
        </div>
    );

class Questions extends Component {


    state = {
        visible: false,
        topic: '',
        question: '',
        comments: [],
        author: '',
        followers: [],
        submitting: false,
        value: '',
        allTopics: "",
        selectedTopics: "",
        topicsFollowed: "",
        allQuestions: "",
        pagenumber: 1

    }

    async componentDidMount() {
        let data = { email: cookie.load("cookie_user"), type: 1 }
        // GET all the topics followed by the user and then GET all the questions in these topics. The final object is rendered onto the page
        try {
            let response = await API.get("topicsFollowed", { params: data });
            if (typeof (response.data) === "object") {
                let allQuestionsInTopics = [];
                for (const obj of response.data) {
                    if (obj._id !== undefined) {
                        let data_1 = { topicId: obj._id }
                        let response_1 = null;
                        response_1 = await API.get("questionsInTopic", { params: data_1 });

                        if (typeof (response_1.data) === "object") {
                            for (const obj_1 of response_1.data) {
                                allQuestionsInTopics.push(obj_1);
                            }
                        }

                    }
                }
                let sourceArray = allQuestionsInTopics

                // Shuffling all the question objects
                for (var i = 0; i < sourceArray.length - 1; i++) {
                    var j = i + Math.floor(Math.random() * (sourceArray.length - i));

                    var temp = sourceArray[j];
                    sourceArray[j] = sourceArray[i];
                    sourceArray[i] = temp;
                }

                this.setState({ allQuestions: sourceArray });
            }
        } catch (error) {
            console.log(error.response);
            //message.error("Unable to show followed topics. Please refresh the page.");
        }
    }



    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });


        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    {
                        author: 'Han Solo',
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content: <p>{this.state.value}</p>,
                        datetime: moment().fromNow(),
                    },
                    ...this.state.comments,
                ],
            });
        }, 1000);
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }

    showModal = async () => {
        // When "Add Question" button is clicked, we fetch all available topics from the backend. We will use these in the autocomplete for selecting topics for the new question
        try {
            let response = null;
            response = await API.get("fetchAllTopics");
            console.log(response.data)
            this.setState({ allTopics: response.data })
        } catch (error) {
            console.log("Unable to fetch topics from the backend /fetchAllTopics route", error);
        }
        this.setState({
            visible: true,
        });
    }

    handleOk = async (e) => {
        // For 'Add a question' modal

        // Check if no topic is selected
        if (this.state.selectedTopics[0] === undefined) {
            message.error("Please select atleast one topic for the question.")
            return;
        }

        // Check if the question string is empty or does not have any alphabet in it
        if (this.refs.question.value === "" || (/[a-z]/.test(this.refs.question.value.toString().toLowerCase())) === false) {
            message.error("Please enter a valid question.")
            return;
        }

        try {
            // this.state.selectedTopics contains the topic titles
            let data = { email: cookie.load("cookie_user"), question: this.refs.question.value, topicTitles: this.state.selectedTopics }
            // GET topicsFollowed backend route is being used here to follow if not already followed. GET topicsFollowed backend route is being used in the Topics.js frontend to GET all topics followed by this user. They type property in data determines which frontend component is calling /topicsFollowed 
            let response = null;
            response = await API.post("questions", data);
            message.success("Question added!")
            this.setState({
                visible: false,
            });

        } catch (error) {
            console.log(error);
            message.error("Unable to add question at the moment. Please refresh the page and try again.")
        }
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleTopicChange = (value) => {
        this.setState({ selectedTopics: value })
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

        console.log("All questions from followed topics: ", this.state.allQuestions)
        // For autocomplete and multiple select for topics in modal of add question
        const Option = Select.Option;
        const children = [];
        for (const obj of this.state.allTopics) {
            // If displayed string is {obj.title} then keep key also {obj.title} and ant design autocorrect is working by finding string in the key and not in the displayed string itself
            children.push(<Option key={obj.title}>{obj.title}</Option>);
        }

        const { comments, submitting, value } = this.state;

        let displayHeading = null;

        let displayedResults = null;
        if (this.state.allQuestions === "" || this.state.allQuestions === undefined) {
            displayedResults = (<div><div style={{ textAlign: "center", fontSize: 15 }}>Follow your first topic to start using Quora!</div><br /><br /></div>);
        } else {
            if (this.state.allQuestions[0] === undefined) {
                displayedResults = <div style={{ textAlign: "center", fontSize: 15 }}>Follow your first topic to start using Quora!</div>;

            } else {
                var pagination = null;
                let allQuestions = null;
                let pageQuestions = []; // questions to show on this page number

                let pageNumbers = Math.floor(this.state.allQuestions.length / 5) + 1;
                pagination = <Pagination defaultPageSize={1} defaultCurrent={1} total={pageNumbers} onChange={this.handlePageNumberClick} />;
                allQuestions = this.state.allQuestions;
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
                displayHeading = (<h5>Questions from the topics that you follow:</h5>)
            }

        }






        return (
            <Card>
                <div style={{ textAlign: "right" }}>
                    <Button className="add-button" type="primary" onClick={this.showModal}>
                        Ask a Question
                    </Button>
                </div>
                <br />
                <div style={{ marginLeft: "15%" }}>
                    {displayHeading}
                    <br />
                </div>
                {displayedResults}

                <div style={{ textAlign: "center" }}>{pagination}</div>

                <Modal
                    title="Ask a Question"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    // To remove any input when cancel is pressed
                    destroyOnClose="true"
                >
                    <div>
                        <label for="comment">
                            <label for="comment">Tips on getting good answers quickly:</label>
                            <ul className="modal-list">
                                <li><Icon type="check-circle" theme="twoTone" /> Make sure your question hasn't been
                                    asked already
                                </li>
                                <li><Icon type="check-circle" theme="twoTone" /> Keep your question short and to the
                                    point
                                </li>
                                <li><Icon type="check-circle" theme="twoTone" /> Double-check grammar and spelling:</li>
                            </ul>
                        </label>
                    </div>
                    <div class="form-group">
                        <label for="comment">Question:</label>
                        <textarea class="form-control" rows="5" id="comment"
                            placeholder="Start your Question with What, How, Why etc" ref="question"></textarea>
                    </div>
                    <div>
                        <label for="topic">Select Topics:</label>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Please select topics for the question"
                            onChange={this.handleTopicChange}
                        >
                            {children}
                        </Select>

                    </div>
                </Modal>
            </Card>
        )
    }
}


function mapStateToProps(state) {
    return {
        authFlag: state.authFlag,
        question: state.question,
        topic: state.topic,
        author: state.author,
        followers: state.followers
    };
}
// export default Questions;
export default connect(mapStateToProps, { addQuestion })(Questions);