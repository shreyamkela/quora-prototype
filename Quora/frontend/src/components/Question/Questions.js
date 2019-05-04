import React, { Component } from 'react'
import { Modal, Button, Icon, Card, Comment, Avatar, Form, List, Input, AutoComplete, Select, message } from 'antd';
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
        allTopics: ""

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
        });
    }

    handleTopicChange = (value) => {
        console.log(`selected ${value}`);
    }

    render() {

        // For autocomplete and multiple select for topics in modal of add question
        const Option = Select.Option;
        const children = [];
        for (const obj of this.state.allTopics) {
            children.push(<Option key={obj._id}>{obj.title}</Option>);
        }

        const { comments, submitting, value } = this.state;
        return (
            <div>
                <Button className="add-button" type="primary" onClick={this.showModal}>
                    Add Question
                </Button>
                <Modal
                    title="Add a Question"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
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
                            placeholder="Start your Question with What, How, Why etc"></textarea>
                    </div>
                    <div>
                        <label for="topic">Select Topics:</label>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onChange={this.handleTopicChange}
                        >
                            {children}
                        </Select>

                    </div>
                </Modal>
                <br /><br />
                <div>
                    <div>
                        <Card
                            type="inner"
                            title="Question goes here"
                            extra={<a className="Bookmark" href="#">Bookmark</a>}
                        >
                            <Meta
                                avatar={<Avatar
                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title="User's name goes here"
                                description="User credentials goes here"

                            />
                            <br />

                            <div>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                has been the industry's standard dummy text ever since the 1500s, when an unknown
                                printer took a galley of type and scrambled it to make a type specimen book. It has
                                survived not only five centuries, but also the leap into electronic typesetting,
                                remaining essentially unchanged. It was popularised in the 1960s with the release of
                                Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                                publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            </div>
                            <div>
                                {comments.length > 0 && <CommentList comments={comments} />}
                                <Comment
                                    avatar={(
                                        <Avatar
                                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                            alt="Han Solo"
                                        />
                                    )}
                                    content={(
                                        <Editor
                                            onChange={this.handleChange}
                                            onSubmit={this.handleSubmit}
                                            submitting={submitting}
                                            value={value}
                                        />
                                    )}
                                />
                            </div>
                        </Card></div>
                </div>
            </div>
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