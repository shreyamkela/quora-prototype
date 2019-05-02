import React, {Component} from 'react'
import {Card,Avatar} from 'antd';
import {connect} from 'react-redux';
import {fetchAnswersByQID} from "../../actions";
import cookie from 'react-cookies';
import _ from "lodash";
import Comments from "./Comments"
const {Meta} = Card;

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
        this.props.fetchAnswersByQID('5ccb33f0cc26351195ae6d72')
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
        ques_answers:state.ques_answers
    };
  }
export default connect(mapStateToProps,{ fetchAnswersByQID })(Answers);