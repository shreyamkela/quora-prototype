import React, {Component} from 'react'
import {Card,Avatar} from 'antd';
import {connect} from 'react-redux';
import {fetchAnswersByQID,displayAddAnswerForm,voteAnswer} from "../../actions";
import cookie from 'react-cookies';
import _ from "lodash";
import Comments from "./Comments"
import QuoraButton from "../QuoraButton"
import AddEditAnswer from './AddEditAnswer';
const {Meta} = Card;


class Answers extends Component {


    state = {
        visible: false,
        topic: '',
        comments: [],
        submitting: false,
        value: '',

    }

    componentDidMount() {
        console.log("Mounting")
        this.props.fetchAnswersByQID('5ccb33f0cc26351195ae6d72')
    }

    addAnswerClick = () => {
        this.props.displayAddAnswerForm(true)
    }

    vote = (a_id,vote) => {
        this.props.voteAnswer(a_id,{flag:vote},()=>{this.props.fetchAnswersByQID('5ccb33f0cc26351195ae6d72')})
    }
    renderQuestion = () => {
        if (this.props.ques_answers.question !== undefined) {
            let d = new Date(this.props.ques_answers.posted_on)
            let addForm = null
           
            if (this.props.displayAddAnswer === true)
                addForm = <AddEditAnswer></AddEditAnswer>
            else addForm = null
            return (
                <Card>
                    <div>
                        <Meta
                            avatar={<Avatar
                                src={this.props.ques_answers.profile.photo} />}//"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                            title={this.props.ques_answers.profile.firstname + "  " + this.props.ques_answers.profile.lastname}//"User's name goes here"
                            description={<div>{this.props.ques_answers.profile.credentials}
                                <div>
                                    {d.toLocaleDateString()}&nbsp;&nbsp;
                                    {d.toLocaleTimeString()}
                                </div>
                            </div>
                            }
                        />
                        <h3><b> {this.props.ques_answers.question}</b></h3>
                        <QuoraButton value="answer" text="Answer" onclick={() => this.addAnswerClick()}></QuoraButton>
                        {addForm}
                    </div>

                    {this.renderAnswers()}
                
                </Card>
            )
        }
        else return null
    }

    renderAnswers=()=> {
       
        return _.map(this.props.ques_answers.answers, answer => {
            let d = new Date(answer.answered_on)
            let content = ''
            if (answer.content !== undefined) {
                content = answer.content.split('\n').map(i => {
                    return <>{i}<br></br></>
                })
            }
            let photo = answer.profile.photo
            let firstname = answer.profile.firstname
            let lastname = answer.profile.lastname
            let credentials = answer.profile.credentials
            if (answer.isAnonymous === 1 && answer.author !== cookie.load('cookie_user')) {
                photo = ""
                firstname = "Anonymous"
                lastname = ""
                credentials=""
            }

            let upvoteOption = <QuoraButton value="upvote" text={"Upvote " + answer.votes.length} onclick={()=>this.vote(answer._id,1)}></QuoraButton>
            if (answer.author === cookie.load('cookie_user'))
                upvoteOption = <font color="gray">{answer.votes.length + " Upvotes"}</font>
            return (
                <Card bordered={false} style={{borderTop:"1px solid #e2e2e2"}}>
                 
                    <div>
                    <Meta
                    avatar={<Avatar
                            src={photo} />}//"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                            title={firstname+"  "+lastname}//"User's name goes here"
                            description={<div>{credentials}
                                <div>
                            {d.toLocaleDateString()}&nbsp;&nbsp;
                            {d.toLocaleTimeString()}
                            </div>
                            </div>}//"User credentials goes here"
                     />
                <br></br>
                        <div>
                        
                            {content}
                        </div>  <br></br>
                        <div>
                        {upvoteOption}
                        <QuoraButton value="ellipsis" text=''></QuoraButton>
                        </div>
                        <br></br>
                </div>
                <div>
                    <Comments></Comments>
                </div>
            </Card>
            )
        })
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
        ques_answers: state.ques_answers,
        displayAddAnswer:state.displayAddAnswer
    };
  }
export default connect(mapStateToProps,{ fetchAnswersByQID,displayAddAnswerForm,voteAnswer })(Answers);