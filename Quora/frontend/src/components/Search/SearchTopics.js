import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Card, Row, Col, message } from "antd";
import cookie from "react-cookies";
import API from "../../utils/API";

class SearchTopics extends Component {

  async handleFollow(key) {
    //console.log(key)
    try {
      let data = { email: cookie.load("cookie_user"), type: 2, topicId: key }
      // GET topicsFollowed backend route is being used here to follow if not already followed. GET topicsFollowed backend route is being used in the Topics.js frontend to GET all topics followed by this user. They type property in data determines which frontend component is calling /topicsFollowed 
      let response = null;
      response = await API.get("topicsFollowed", { params: data });
      if (response.data.toLowerCase().includes("already")) {
        message.warning("Topic already followed!")
      } else {
        message.success("Topic followed!")
      }
    } catch (error) {
      console.log(error);
      message.error("Unable to follow topic at the moment. Please refresh the page and try again.")
    }

  }

  async handleUnfollow(key) {
    //console.log(key)
    try {
      let data = { email: cookie.load("cookie_user"), topicId: key }
      let response = null;
      response = await API.post("topicsUnfollowed", data);
      if (response.data.toLowerCase().includes("already")) {
        message.warning("Topic is not followed!")
      } else {
        message.success("Topic Unfollowed!")
      }
    } catch (error) {
      console.log(error);
      message.error("Unable to unfollow topic at the moment. Please refresh the page and try again.")
    }

  }

  render() {
    // To access the state passed into this component from parent through this.props.history.push - we use this.props.history.location.state
    console.log("SearchTopics component: ", this.props.history.location.state);
    let searchResults = null;
    if (this.props.history.location.state.searchResults !== undefined) {
      searchResults = this.props.history.location.state.searchResults
    }
    let displayedResults = null;
    if (searchResults === null || searchResults[0] === undefined) {
      displayedResults = <div style={{ textAlign: "center", fontSize: 15 }}>No topics found for this search.</div>;
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
  return;
}
export default connect(mapStateToProps)(SearchTopics);
