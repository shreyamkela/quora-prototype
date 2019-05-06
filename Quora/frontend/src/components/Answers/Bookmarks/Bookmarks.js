import React, {Component} from 'react'
import {Card,Avatar} from 'antd';
import {connect} from 'react-redux';
import cookie from 'react-cookies';
import _ from "lodash";
import { fetchBookmarkedAnswers } from "../../../actions";
import { Link } from 'react-router-dom';
import NoData from "../NoData"
const {Meta} = Card;


class Bookmarks extends Component {

    componentDidMount() {
        console.log("Mounting")
        this.props.fetchBookmarkedAnswers()
    }

    renderQuestion = () => {
        if(this.props.bookmarked_answers.length>0)
        return _.map(this.props.bookmarked_answers, question => {
            return (
                <Card>
                    <div>
                        <h3><b> {question.question}</b></h3>
                    </div>

                    {this.renderAnswers(question.answers)}
                
                </Card>
            )
        })
        else {
            return(
                <NoData image="https://qsf.fs.quoracdn.net/-3-images.question_prompt.answer.svg-26-c8e51e98fe29ee96.svg" description="No Bookmarked Answers" left='350px' />
            )
        }
    }

    renderAnswers=(answers)=> {
       
        return _.map(answers, answer => {
            let d = new Date(answer.answered_on)
            let content = ''
            if (answer.content !== undefined) {
                content = content = <div dangerouslySetInnerHTML={{__html: answer.content}} />
            }
            let photo = answer.profile.photo
            let firstname = answer.profile.firstname
            let lastname = answer.profile.lastname
            let credentials = answer.profile.credentials
            let answer_title = <Link to={{
                pathname: '/main/profile/'+answer.author
            }} >{firstname + "  " + lastname}</Link>

            if (answer.isAnonymous === 1 && answer.author !== cookie.load('cookie_user')) {
                photo = ""
                firstname = "Anonymous"
                lastname = ""
                credentials = ""
                answer_title=firstname + "  " + lastname
            }
            if(answer.profile.deactivated) answer_title=firstname + "  " + lastname
            return (
                <>
                <Card bordered={false} style={{borderTop:"1px solid #e2e2e2"}}>
                    
                    <div>
                    <Meta
                    avatar={<Avatar
                            src={photo} />}//"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                            title={answer_title}//{firstname+"  "+lastname}//"User's name goes here"
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
                    </div>
                    
                </Card>
                <br></br>
                <font color="gray">{answer.votes.filter(v => v.flag === 1).length + " Upvotes"}</font>
                <br></br>
                </>
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
        bookmarked_answers:state.bookmarked_answers
    };
  }
export default connect(mapStateToProps,{fetchBookmarkedAnswers})(Bookmarks);