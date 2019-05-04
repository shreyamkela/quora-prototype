import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Card, Row, Col, message } from "antd";
import cookie from "react-cookies";
import API from "../../utils/API";

class SearchQuestions extends Component {


    render() {
        // To access the state passed into this component from parent through this.props.history.push - we use this.props.history.location.state
        console.log("SearchQuestions component: ", this.props.history.location.state);
        let searchResults = null;
        if (this.props.history.location.state.searchResults !== undefined) {
            searchResults = this.props.history.location.state.searchResults
        }
        let displayedResults = null;
        if (searchResults === null || searchResults[0] === undefined) {
            displayedResults = <div style={{ textAlign: "center", fontSize: 15 }}>No questions found for this search.</div>;
        } else {
            displayedResults = searchResults.map(key => (
                <div style={{ textAlign: "center" }}>
                    <div className="card" style={{ width: "70%", height: 100, textAlign: "center" }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ fontSize: 15, marginLeft: 20, marginTop: 20 }}>
                                {key.title}
                            </h5>
                            <br />
                            <Row style={{ marginLeft: 205 }}>
                                <Col span={6}>
                                    <Button size="small" icon="check-circle" shape="round" onClick={() => this.handleFollow(key._id)} >
                                        Follow
                                    </Button>
                                </Col>
                                <Col span={6}>
                                    <Button size="small" icon="close-circle" shape="round" onClick={() => this.handleUnfollow(key._id)}>
                                        Unfollow
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <br />
                    <br />
                </div>
            ));
        }

        return (
            <div>
                <Card>
                    <div>
                        <font size="4">
                            <b>Results:</b>
                        </font>
                        <br />
                        <br />
                        {displayedResults}
                    </div>
                </Card>
            </div>
        );
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return ;
}
export default connect(mapStateToProps)(SearchQuestions);
