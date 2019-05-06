import React, {Component} from 'react'
import {Card,Avatar} from 'antd';
import {connect} from 'react-redux';
import cookie from 'react-cookies';
import _ from "lodash";
import { fetchUserAnswers,displayAddAnswerForm } from "../../../actions";
import QuoraButton from "../../QuoraButton"
import AddEditAnswer from '../AddEditAnswer';
import NoData from '../NoData';
const {Meta} = Card;


class UserAnswers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAnswer:''
        }
    }
    componentDidMount() {
        console.log("Mounting")
        this.props.fetchUserAnswers()
    }

    editAnswerClick = (a_id) => {
        this.setState({
            currentAnswer:a_id
        })
        this.props.displayAddAnswerForm(true)
    }

    renderQuestion = () => {
        if(this.props.userAnswers.length>0)
        return _.map(this.props.userAnswers, question => {
            let addForm = null
           
            if (this.props.displayAddAnswer === true && this.state.currentAnswer === question.answers[0]._id)
                addForm = <AddEditAnswer answer_id={this.state.currentAnswer} content={question.answers[0].content}></AddEditAnswer>
            else addForm = null
            return (
                <Card>
                    <div>
                        <h3><b> {question.question}</b></h3>
                            <QuoraButton value="answer" text="Edit Answer" onclick={()=>this.editAnswerClick(question.answers[0]._id)}></QuoraButton>
                    </div>
                    {addForm}
                    {this.renderAnswers(question.answers)}
                
                </Card>
            )
        })
        else {
            return(
                <NoData image="https://qsf.fs.quoracdn.net/-3-images.question_prompt.answer.svg-26-c8e51e98fe29ee96.svg" description="You haven't answered any questions yet" left='300px' />
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
            return (
                <>
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
        userAnswers: state.userAnswers,
        displayAddAnswer:state.displayAddAnswer
    };
  }
export default connect(mapStateToProps,{fetchUserAnswers,displayAddAnswerForm})(UserAnswers);