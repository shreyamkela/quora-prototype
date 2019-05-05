import React, {Component} from 'react'
import {Button, Card, Comment, Avatar, Form, List, Input,} from 'antd';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from "lodash";
import { commentOnAnswer,fetchProfile } from '../../actions'
import axios from 'axios';
import cookie from 'react-cookies';
import API from '../../utils/API'
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
        photo:''

    }

    componentDidMount=()=>{
        this.setState({
        comments:_.map(this.props.comments, comment => {
            return {
                author: 'Han Solo',
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                content: <p>{comment.comment}</p>,
                datetime: comment.postedon
            }
        })
        })
        this.props.fetchProfile(cookie.load('cookie_user'))
        API.get(`profile/pic/?email_id=` + (cookie.load('cookie_user')))
            .then((response) => {
                //  alert("The file is successfully uploaded");
                console.log("printing response" + JSON.stringify(response.data))
                this.setState({
                    photo: response.data.photo,
                });
            });
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
                        ...this.state.comments,
                        {
                            author: this.props.profile.data.firstname + "  "+this.props.profile.data.lastname,
                            avatar: this.state.photo,
                            content: <p>{this.state.value}</p>,
                            datetime: moment().fromNow(),
                        },
                        
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
                    </Card>
                    </div>
        )
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return {
        authFlag: state.authFlag,
        profile: state.profile.items
    };
}
  
export default connect(mapStateToProps, { commentOnAnswer,fetchProfile })(Comments);
