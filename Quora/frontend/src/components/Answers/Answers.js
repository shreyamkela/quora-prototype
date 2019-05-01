import React, {Component} from 'react'
import {Modal, Button, Icon, Card, Comment, Avatar, Form, List, Input,} from 'antd';
import {connect} from 'react-redux';
import moment from 'moment';
import {fetchAnswersByQID} from "../../actions";
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
        comments: [],
        submitting: false,
        value: '',

    }

    //get the announcements data from backend  
    componentDidMount() {
        console.log("Mounting")
        this.props.fetchAnswersByQID('5cc79f545ed54a2898599b7b')
    }

    renderQuestion = () => {
        if(this.props.ques_answers.question !== undefined)
        return(
                <Card
                type="inner"
                title={<div>
                    <Meta
            avatar={<Avatar
            src={this.props.ques_answers.profile.photo} />}//"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
            title={this.props.ques_answers.profile.firstname}//"User's name goes here"
            description={this.props.ques_answers.profile.credentials}//"User credentials goes here"

                />
                    {this.props.ques_answers.question}
                </div>}
                >
                {this.renderAnswers()}
                
                </Card>
        )
        else return null
    }

    renderAnswers=()=> {
       
        return _.map(this.props.ques_answers.answers, answer => {
            let d = new Date(answer.answered_on)
            return (
                <Card>
                            
                <br/>

                    <div>
                    <Meta
            avatar={<Avatar
            src={answer.profile.photo} />}//"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
            title={answer.profile.firstname}//"User's name goes here"
                            description={<div>{answer.profile.credentials}
                                <div>
                            {d.toLocaleDateString()}&nbsp;&nbsp;
                            {d.toLocaleTimeString()}
                        </div>
                            </div>}//"User credentials goes here"

                        />
                <br></br>
                        <div>
                        
                            {answer.content}
                        </div>                        
                </div>
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
            </Card>
            )
        })
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
                
                <div>
                    <div>
                        
                        {this.renderQuestion()}
                    </div>


                </div>
            </div>
        )
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return {
        authFlag: state.authFlag,
        ques_answers:state.ques_answers
    };
  }
export default connect(mapStateToProps,{ fetchAnswersByQID })(Answers);