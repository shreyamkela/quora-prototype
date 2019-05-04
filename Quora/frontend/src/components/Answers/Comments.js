import React, {Component} from 'react'
import {Button, Card, Comment, Avatar, Form, List, Input,} from 'antd';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from "lodash";
import { commentOnAnswer } from '../../actions'
import { Field, reduxForm } from "redux-form"

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
                    <TextArea rows={1} cols={60} onChange={onChange} value={value}/>
        </Form.Item>
        <Form.Item> 
            <Button
                htmlType="submit"
                loading={submitting}
                type="primary"
                onClick={onSubmit}
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
            this.props.commentOnAnswer(this.props.answer_id, this.state.value, () => {
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
                        ..._.map(this.props.comments, comment => {
                            return {
                                author: 'Han Solo',
                                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                                content: <p>{comment.comment}</p>,
                                datetime: comment.postedon
                            }
                        }),
                    ],
                });
            })
        }, 1000);
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }



    render() {
        return (
            <div>  
                <Card style={{background:"#fafafa"}}>
                    {this.props.comments.length > 0 && <CommentList comments={this.props.comments}/>}
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
                    </Card>
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
  
export default connect(mapStateToProps, { commentOnAnswer })(Comments);
