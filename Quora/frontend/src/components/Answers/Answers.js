import React, {Component} from 'react'
import {Modal, Button, Icon, Card, Comment, Avatar, Form, List, Input,} from 'antd';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';
import {fetchProfile} from "../../actions";
import cookie from 'react-cookies';
import _ from "lodash";

const gridStyle = {
    width: '90%',
    textAlign: 'center',
}
const {Meta} = Card;

const TextArea = Input.TextArea;

const CommentList = ({comments}) => (
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
            <TextArea rows={4} onChange={onChange} value={value}/>
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

class Answers extends Component {


    state = {
        visible: false,
        topic: '',
        question: '',
        comments: [],
        submitting: false,
        value: '',

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



    render() {
        if(!cookie.load('cookie_user')){
            this.props.history.push("/login");
        }
        const {comments, submitting, value} = this.state;
        return (
            <div>
                
                <div>
                    <div>
                        <Card
                            type="inner"
                            title="Question 1" /*Display question here*/
                            extra={<a href="#">Bookmark</a>}
                        >
                            <Meta
                                avatar={<Avatar
                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                                title="User's name goes here"
                                description="User credentials goes here"

                            />
                            <br/>

                            <div>
                                Answer for Q1{/*Display the answer here*/}
                            </div>
                            <div>
                                {comments.length > 0 && <CommentList comments={comments}/>}
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

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return {
        authFlag: state.authFlag
    };
  }
export default connect(mapStateToProps,{ fetchProfile })(Answers);