import React, { Component } from "react";
import cookie from "react-cookies";
import { connect } from "react-redux";
import { Layout, Card, message } from "antd";

import API from "../../utils/API";

const { Content } = Layout;

class Topics extends Component {
  state = { topicsFollowed: "" };

  async componentDidMount() {
    let data = { email: cookie.load("cookie_user"), type: 1 }
    // GET topicsFollowed backend route is being used here to GET all topics followed by this user. GET topicsFollowed backend route is being used in the SearchTopics.js frontend to follow if not already followed. They type property in data determines which frontend component is calling /topicsFollowed 
    try {
      let response = await API.get("topicsFollowed", { params: data });
      message.success("SUCCESS");
      this.setState({ topicsFollowed: response.data });
    } catch (error) {
      console.log(error.response);
      message.error("Unable to show followed topics. Please refresh the page.");
    }
  }

  render() {
    console.log("Topics followed:", this.state.topicsFollowed);
    return (
      <div>
        <Card>
          <Content style={{ background: "#fff" }}>Followed Topics</Content>
        </Card>
      </div>
    );
  }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) { }
export default connect(mapStateToProps)(Topics);
