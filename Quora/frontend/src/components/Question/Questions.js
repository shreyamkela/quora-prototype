import React, {Component} from 'react'
import {Modal, Button, Icon} from 'antd';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {fetchProfile} from "../../actions";
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import _ from "lodash";

class Questions extends Component {


    state = {
        visible: false,
        topic: '',
        question: '',

    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    render() {


        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Add Question
                </Button>
                <Modal
                    title="Add a Question!"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div>
                        <label for="comment">
                            <label for="comment">Tips on getting good answers quickly:</label>
                            <ul className="modal-list">
                                <li><Icon type="check-circle" theme="twoTone" />    Make sure your question hasn't been asked already</li>
                                <li><Icon type="check-circle" theme="twoTone" />    Keep your question short and to the point</li>
                                <li><Icon type="check-circle" theme="twoTone" />    Double-check grammar and spelling:</li>
                            </ul>
                        </label>
                    </div>
                    <div class="form-group">
                        <label for="comment">Question:</label>
                        <textarea class="form-control" rows="5" id="comment"
                                  placeholder="Start your Question with What, How, Why etc"></textarea>
                    </div>
                    <div>
                        <label for="topic">Topic:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="topic"
                            placeholder="Enter the topic for your question"
                            // value={this.state.fname}
                            onChange={this.handleChange}
                        />                    </div>
                </Modal>
                <div>

                </div>
            </div>
        )
    }
}

export default Questions;