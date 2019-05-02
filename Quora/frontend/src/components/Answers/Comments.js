import React, {Component} from 'react'
import {Button, Card, Comment, Avatar, Form, List, Input,} from 'antd';
import {connect} from 'react-redux';
import moment from 'moment';
import cookie from 'react-cookies';
import _ from "lodash";

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
            <Form layout='inline'>
        <Form.Item>
                    <TextArea rows={1} cols={68} onChange={onChange} value={value}/>
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
                </Form>
    </div>
);

class Comments extends Component {


    state = {
        visible: false,
        topic: '',
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
        return (
            <div>  
                    {this.state.comments.length > 0 && <CommentList comments={this.state.comments}/>}
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
                                submitting={this.state.submitting}
                                value={this.state.value}
                            />
                        )}
                    />
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
export default connect(mapStateToProps)(Comments);