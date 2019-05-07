
import React, { Component } from 'react'
import { Card, Avatar, Icon, Input, Button } from 'antd';
import { connect } from 'react-redux';
import { displayAddAnswerForm, addAnswer, fetchAnswersByQID, editAnswer, fetchUserAnswers, fetchProfile } from "../../actions";
import { Field, reduxForm } from "redux-form"
import RTE from './RichTextEditor'
import cookie from 'react-cookies';
import API from '../../utils/API'
const { Meta } = Card;

const TextArea = Input.TextArea;

class AddEditAnswer extends Component {
    constructor(props) {
        super(props)
        this.state = { content: '', photo: '', profileData: "" }
    }

    componentWillMount = () => {
        this.props.fetchProfile(cookie.load('cookie_user'))
        API.get(`profile/pic/?email_id=` + (cookie.load('cookie_user')))
            .then((response) => {
                //  alert("The file is successfully uploaded");
                console.log("printing response" + JSON.stringify(response.data))
                API.get(`profile?email_id=` + (cookie.load('cookie_user')))
                    .then((response_1) => {
                        this.setState({
                            photo: response.data.photo, profileData: response_1.data
                        });
                    });

            }).catch((error) => {
                console.log(error)
            });
    }

    onSubmit = (values) => {
        if (values.isanonymous) values.isanonymous = 1
        else values.isanonymous = 0
        values.answer = this.state.content
        if (this.props.question_id !== undefined)
            this.props.addAnswer(this.props.question_id, values, () => {
                this.props.displayAddAnswerForm(false);
                this.props.fetchAnswersByQID(this.props.question_id)
            })
        else if (this.props.answer_id !== undefined)
            this.props.editAnswer(this.props.answer_id, values, () => {
                this.props.displayAddAnswerForm(false);
                this.props.fetchUserAnswers()
            })
        this.props.displayAddAnswerForm(false);

    }
    renderAnswerField = (field) => {
        const { meta: { touched, error } } = field;
        const className = `form-group ${touched && error ? "has-danger" : ""}`;
        return (
            <div className={className} style={{ width: '100%' }} >
                <TextArea hidden rows={field.rows} placeholder={field.label} className="form-control" type={field.type}{...field.input}></TextArea>
            </div>
        )

    }
    /*
    renderRTE = (field) => {
        const { meta: { touched, error } } = field;
        const className = `form-group ${touched && error ? "has-danger" : ""}`;
        return (
        <div className={className} style={{width: '100%'}} >
                <RTE placeholder={field.label}
                    onChange={(newValue, delta, source) => {
                        if (source === 'user') {
                          field.input.onChange(newValue);
                        }
                    }}
                    onBlur={(range, source, quill) => {
                        field.input.onBlur(quill.getHTML());
                      }}
                ></RTE>
        </div>
        )
    }*/


    onRTEChange = (content) => {
        this.setState({
            content: content
        })
    }

    renderAnonymousCheck = (field) => {
        const { meta: { touched, error } } = field;
        return (
            <input className="form-control" type={field.type}{...field.input} style={{ display: "inline" }}></input>
        )
    }
    render() {


        const { handleSubmit } = this.props;
        return (
            <div>
                <Card
                    title={<Meta
                        avatar={<Avatar
                            src={this.state.photo === "" ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" : this.state.photo} />}//"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                        title={(this.state.profileData === "" ? null : this.state.profileData.firstname) + "  " + (this.state.profileData === "" ? null : this.state.profileData.lastname)}
                        description={(this.state.profileData === "" ? null : this.state.profileData.credentials)}
                    />}
                    style={{ width: "90%", marginTop: 16, marginLeft: 20, marginRight: 40 }}


                >
                    <div style={{ width: "100%" }}>
                        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                            {/*<Field rows={6} label="Write your Answer" name="answer" component={this.renderAnswerField}></Field>*/}
                            <RTE content={this.props.content} placeholder="Write your answer" callChange={(e) => this.onRTEChange(e)}></RTE>
                            {/*<Field name='answer' label='Write your answer' component={this.renderRTE}/>*/}
                            <div style={{ background: "#fafafa", padding: "15px", width: "100%" }}>
                                <Button type="primary" htmlType="submit">Submit</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                                <Field type="checkbox" name="isanonymous" component={this.renderAnonymousCheck}></Field>&nbsp;&nbsp;<label style={{ display: "inline" }}>Anonymously</label>
                                <Icon style={{ float: "right" }} type="ellipsis" /></div>
                        </form>
                    </div>

                </Card>
            </div>
        )
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return {
        authFlag: state.authFlag,
        profile: state.profile.items,
        initialValues: {
            isanonymous: false
        }
    };
}

AddEditAnswer = reduxForm({
    form: 'AddEditAnswerForm',
    enableReinitialize: true,

})(AddEditAnswer)

AddEditAnswer = connect(
    mapStateToProps,
    { displayAddAnswerForm, addAnswer, fetchAnswersByQID, editAnswer, fetchUserAnswers, fetchProfile }
)(AddEditAnswer)


export default AddEditAnswer;