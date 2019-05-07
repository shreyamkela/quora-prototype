import React, {Component} from 'react'
import {Card, Avatar} from 'antd';
import {connect} from 'react-redux';
import cookie from 'react-cookies';
import _ from "lodash";
import {fetchQuestions, fetchUserAnswers, displayAddAnswerForm, fetchProfile} from "../../actions";
import QuoraButton from "../QuoraButton"
import AddEditAnswer from '../Answers/AddEditAnswer';
import NoData from '../Answers/NoData';
import axios from "axios/index";

const {Meta} = Card;

class MyQuestions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questionArray: [],
            currentAnswer: ''
        }
    }

    componentDidMount() {
        console.log("My QUESTIONS");
        // this.props.fetchQuestions()
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.get("http://localhost:3001/fetchQuestions")
            .then(response => {
                console.log(response.data);

                this.setState({
                    questionArray: response.data
                });

            })
            .catch(error => {
                return error.response
            })

    }

    handleQuestionLinkClick = (key) => {
        this.props.history.push({ // This is how we pass data from this component to a child component i.e searchQuestions,
            // using the history.push. This will change the route, render new component, and also pass data into the component.
            // Passed data can be accessed in the child component through this.props.history.location.state.
            // To pass these props into the child component we have used <Route exact path="/main/questions/search" render={(props) => <SearchQuestions {...props} />} />
            pathname: `/main/${key._id}`,
            state: {
                selectedQuestion: key
            }
        }) // TODO - Complete the page `/main/${key._id}`
    }

    renderQuestion = () => {
        const {questionArray} = this.state;
        if (questionArray !== undefined) {
            if (questionArray.length > 0)
                return _.map(questionArray, question => {
                    let addForm = null;
                    if (question.answers[0] !== undefined) {
                        if (this.props.displayAddAnswer === true && this.state.currentAnswer === question.answers[0]._id)
                            addForm = <AddEditAnswer answer_id={this.state.currentAnswer}
                                                     content={question.answers[0].content}></AddEditAnswer>
                        else addForm = null
                    }
                    return (
                        <Card>
                            <div>
                                <h3><b> {question.question}</b></h3>
                                <href to="#" onClick={() => {
                                    this.handleQuestionLinkClick(question)
                                }}>
                                    <QuoraButton value="answer" text="Add Answer"> </QuoraButton>
                                </href>
                            </div>
                            {addForm}
                            {this.renderAnswers(question.answers)}
                        </Card>
                    )
                })
        }
        else {
            return (
                <NoData image="https://qsf.fs.quoracdn.net/-3-images.question_prompt.answer.svg-26-c8e51e98fe29ee96.svg"
                        description="You haven't answered any questions yet" left='300px'/>
            )
        }
    }


    renderAnswers = (answers) => {

        return _.map(answers, answer => {
            let d = new Date(answer.answered_on)
            let content = ''
            if (answer.content !== undefined) {
                content = content = <div dangerouslySetInnerHTML={{__html: answer.content}}/>
            }
            let photo = answer.profile.photo;
            let firstname = answer.profile.firstname;
            let lastname = answer.profile.lastname;
            let credentials = answer.profile.credentials;
            return (
                <>
                    <Card bordered={false} style={{borderTop: "1px solid #e2e2e2"}}>

                        <div>
                            <Meta
                                avatar={<Avatar
                                    src={photo}/>}//"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                                title={firstname + "  " + lastname}//"User's name goes here"ok
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
                            </div>
                            <br></br><br></br>
                        </div>

                    </Card>
                    <br></br>
                    <font color="gray">{answer.votes.filter(v => v.flag === 1).length + " Upvotes"}</font>
                    {/*<font color="gray">{answer.votes.length + " Upvotes"}</font>*/}
                    <br></br>
                </>
            )
        })
    }


    render() {
        if (!cookie.load('cookie_user')) {
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
        displayAddAnswer: state.displayAddAnswer,
        fetchQuestion: state.fetchQuestion

    };
}

export default connect(mapStateToProps, {
    fetchQuestions,
    fetchUserAnswers,
    displayAddAnswerForm,
    fetchProfile
})(MyQuestions);