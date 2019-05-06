import React, {Component} from 'react'
import {Card,Avatar} from 'antd';
import {connect} from 'react-redux';
import {fetchAnswersByQID,displayAddAnswerForm,voteAnswer,bookmarkAnAnswer} from "../../actions";
import cookie from 'react-cookies';
import _ from "lodash";
import Comments from "./Comments"
import QuoraButton from "../QuoraButton"
import AddEditAnswer from './AddEditAnswer';
import { Link } from 'react-router-dom';
import NoData from './NoData';
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
        console.log(this.props.match.params.question_id)
        this.props.fetchAnswersByQID(this.props.match.params.question_id)
    }

    addAnswerClick = () => {
        this.props.displayAddAnswerForm(true)
    }

    bookmark = (a_id) => {
        this.props.bookmarkAnAnswer(a_id,()=>{this.props.fetchAnswersByQID(this.props.match.params.question_id)})
    }
    vote = (a_id,vote) => {
        this.props.voteAnswer(a_id,{flag:vote},()=>{this.props.fetchAnswersByQID(this.props.match.params.question_id)})
    }
    renderQuestion = () => {
        if (this.props.ques_answers.question !== undefined) {
            let d = new Date(this.props.ques_answers.posted_on)
            let addForm = null
           
            if (this.props.displayAddAnswer === true)
                addForm = <AddEditAnswer question_id={this.props.match.params.question_id}></AddEditAnswer>
            else addForm = null
            
            let question_title = <Link to={{
                pathname: '/main/profile/'+this.props.ques_answers.author
            }} >{this.props.ques_answers.profile.firstname + "  " + this.props.ques_answers.profile.lastname}</Link>
            
            if (this.props.ques_answers.profile.deactivated)
                question_title = this.props.ques_answers.profile.firstname + "  " + this.props.ques_answers.profile.lastname  
            
            let answerOption = <QuoraButton value="answer" text="Answer" onclick={() => this.addAnswerClick()}></QuoraButton>
            if (this.props.ques_answers.answers.filter(a => a.author === cookie.load('cookie_user')).length !== 0)
                answerOption = <div style={{display:"inline",color:"gray"}}>Answered</div>
            return (
                <Card>
                    <div>
                        <Meta
                            avatar={<Avatar
                                src={this.props.ques_answers.profile.photo} />}//"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                            title={question_title}//{this.props.ques_answers.profile.firstname + "  " + this.props.ques_answers.profile.lastname}//"User's name goes here"
                            description={<div>{this.props.ques_answers.profile.credentials}
                                <div>
                                    {d.toLocaleDateString()}&nbsp;&nbsp;
                                    {d.toLocaleTimeString()}
                                </div>
                            </div>
                            }
                        />
                        <h3><b> {this.props.ques_answers.question}</b></h3>
                        {answerOption}
                        {addForm}
                    </div>

                    {this.renderAnswers()}
                
                </Card>
            )
        }
        else return null
    }

    renderAnswers=()=> {
        if (this.props.ques_answers.answers.length > 0) {
            return _.map(this.props.ques_answers.answers, answer => {
                let d = new Date(answer.answered_on)
                let content = ''
                if (answer.content !== undefined) {
                    content = <div dangerouslySetInnerHTML={{ __html: answer.content }} />
                }
                let photo = answer.profile.photo
                let firstname = answer.profile.firstname
                let lastname = answer.profile.lastname
                let credentials = answer.profile.credentials
                let answer_title = <Link to={{
                    pathname: '/main/profile/' + answer.author
                }} >{firstname + "  " + lastname}</Link>

                if (answer.isAnonymous === 1 && answer.author !== cookie.load('cookie_user')) {
                    photo = ""
                    firstname = "Anonymous"
                    lastname = ""
                    credentials = ""
                    answer_title = firstname + "  " + lastname
                }

                if (answer.profile.deactivated) answer_title = firstname + "  " + lastname

                let upvoteOption = <QuoraButton value="upvote" text={"Upvote " + answer.votes.filter(v => v.flag === 1).length} onclick={() => this.vote(answer._id, 1)}></QuoraButton>
                let downvoteOption = <QuoraButton value="downvote" text='' onclick={() => this.vote(answer._id, 0)}></QuoraButton>
                let bookmarkOption = <QuoraButton value="bookmark" text='Bookmark' onclick={() => this.bookmark(answer._id)}></QuoraButton>
                if (answer.author === cookie.load('cookie_user')) {
                    upvoteOption = <div style={{ display: "inline", float: "left", color: "gray" }}>{answer.votes.filter(v => v.flag === 1).length + " Upvotes"}</div>
                    downvoteOption = null
                    bookmarkOption = null
                }
                if (answer.bookmarks.includes(cookie.load('cookie_user')))
                    bookmarkOption = <div style={{ display: "inline", color: "gray" }}>Bookmarked</div>
                return (
                    <Card bordered={false} style={{ borderTop: "1px solid #e2e2e2" }}>
                 
                        <div>
                            <Meta
                                avatar={<Avatar
                                    src={photo} />}//"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                                title={answer_title}//"User's name goes here"
                                description={<div>{credentials}
                                    <div>
                                        {d.toLocaleDateString()}&nbsp;&nbsp;
                            {d.toLocaleTimeString()}
                                    </div>
                                </div>}//"User credentials goes here"
                            />
                            <br></br>
                            <div className='answer_content'>
                        
                                {content}
                            </div>  <br></br><br></br>
                            <div>
                                {upvoteOption}
                                <div style={{ float: "right" }}>
                                    {downvoteOption}
                                    {bookmarkOption}
                                </div>
                            </div>
                            <br></br><br></br>
                        </div>
                        <div>
                            <Comments answer_id={answer._id} comments={answer.comments}></Comments>
                        </div>
                    </Card>
                )
            })
        }
        else {
            return(
                <NoData image="https://qsf.fs.quoracdn.net/-3-images.question_prompt.answer.svg-26-c8e51e98fe29ee96.svg" description="No Answers Yet" left='350px'/>
            )
        }
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
        displayAddAnswer: state.displayAddAnswer,
        bookmarked_answers:state.bookmarked_answers
    };
  }
export default connect(mapStateToProps,{ fetchAnswersByQID,displayAddAnswerForm,voteAnswer,bookmarkAnAnswer })(Answers);