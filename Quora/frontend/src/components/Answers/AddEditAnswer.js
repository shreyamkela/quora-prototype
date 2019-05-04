
import React, { Component } from 'react'
import {Card,Avatar,Icon,Input,Button} from 'antd';
import { connect } from 'react-redux';
import { displayAddAnswerForm,addAnswer,fetchAnswersByQID } from "../../actions";
import { Field, reduxForm } from "redux-form"
const { Meta } = Card;

const TextArea = Input.TextArea;

class AddEditAnswer extends Component {
    onSubmit = (values) => {
        if (values.isanonymous) values.isanonymous = 1
        else values.isanonymous = 0
        this.props.addAnswer(this.props.question_id, values, () => {
            this.props.displayAddAnswerForm(false);
            this.props.fetchAnswersByQID('5ccb33f0cc26351195ae6d72')
        })
        
    }
    renderAnswerField = (field) => {
        const { meta: { touched, error } } = field;
        const className = `form-group ${touched && error ? "has-danger" : ""}`;
        return(
        <div className={className} style={{width: '100%'}} >
            <TextArea rows={field.rows} placeholder={field.label} className="form-control" type={field.type}{...field.input}></TextArea>
        </div>
        )
        
    }
    renderAnonymousCheck = (field) => {
        const { meta: { touched, error } } = field;
        return(
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
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                        title="User's name goes here"
                        description="credentials"        
                    />}
                    style={{ width: "90%", marginTop: 16,marginLeft:20,marginRight:40 }}
                    
                    
                >
                    <div style={{ width: "100%" }}>
                    <form onSubmit = {handleSubmit(this.onSubmit.bind(this))}>
                    <Field rows={6} label="Write your Answer" name="answer" component={this.renderAnswerField}></Field>
                            <div style={{ background: "#fafafa", padding: "15px", width: "100%" }}>
                                <Button type="primary" htmlType="submit">Submit</Button>&nbsp;&nbsp;&nbsp;&nbsp;   
                                <Field type="checkbox" name="isanonymous" component={this.renderAnonymousCheck}></Field>&nbsp;&nbsp;<label style={{display:"inline"}}>Anonymously</label>
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
        initialValues: {
            isanonymous:false
        }
    };
}
  
AddEditAnswer = reduxForm({
    form: 'AddEditAnswerForm',
    enableReinitialize:true
})(AddEditAnswer)

AddEditAnswer = connect(
    mapStateToProps,
    { displayAddAnswerForm ,addAnswer,fetchAnswersByQID }  
)(AddEditAnswer)


  export default AddEditAnswer;