import React, { Component } from "react";
import cookie from "react-cookies";
import { connect } from "react-redux";
import { Layout, message } from "antd";

import API from "../../utils/API";

const { Content } = Layout;

class Topics extends Component {
  state = { topicsFollowed: "" };

  async componentDidMount() {
    let cookies = cookie.load("cookie_user");
    try {
      let response = await API.get("topicsFollowed", { params: cookies });
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
        <Layout>
          <Content style={{ background: "#fff" }}>Followed Topics</Content>
        </Layout>
      </div>
    );
  }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {}
export default connect(mapStateToProps)(Topics);
