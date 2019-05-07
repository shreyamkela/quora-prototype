import React, { Component } from "react";
import cookie from "react-cookies";
import { connect } from "react-redux";
import { Layout, Card, message, Row, Col, Button, Pagination } from "antd";

import API from "../../utils/API";

const { Content } = Layout;

class Topics extends Component {
  state = { topicsFollowed: "", pagenumber: 1 };

  async componentDidMount() {
    let data = { email: cookie.load("cookie_user"), type: 1 }
    // GET topicsFollowed backend route is being used here to GET all topics followed by this user. GET topicsFollowed backend route is being used in the SearchTopics.js frontend to follow if not already followed. They type property in data determines which frontend component is calling /topicsFollowed 
    try {
      let response = await API.get("topicsFollowed", { params: data });
      if (typeof (response.data) === "object") {
        this.setState({ topicsFollowed: response.data });
      }
    } catch (error) {
      console.log(error.response);
      //message.error("Unable to show followed topics. Please refresh the page.");
    }
  }

  async handleUnfollow(key) {
    console.log(key)
    try {
      let data = { email: cookie.load("cookie_user"), topicId: key }
      let response = null;
      response = await API.post("topicsUnfollowed", data);
      if (response.data.toLowerCase().includes("already")) {
        message.warning("Topic is not followed!")
      } else {
        message.success("Topic Unfollowed!")
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      message.error("Unable to unfollow topic at the moment. Please refresh the page and try again.")
    }

  }

  handleTopicLinkClick = (key) => {
    this.props.history.push({ // This is how we pass data from this component to a child component i.e searchQuestions, using the history.push. This will change the route, render new component, and also pass data into the component. Passed data can be accessed in the child component through this.props.history.location.state. To pass these props into the child component we have used <Route exact path="/main/questions/search" render={(props) => <SearchQuestions {...props} />} />
      pathname: `/main/topics/${key.title}/questions`,
      state: {
        selectedTopic: key
      }
    })
  }

  handlePageNumberClick = e => {
    console.log("Page number changed!", e);
    this.setState({ pagenumber: e });
  };

  render() {
    console.log("Topics followed:", this.state.topicsFollowed);

    let displayedResults = null;
    if (this.state.topicsFollowed[0] === undefined) {
      displayedResults = <div style={{ textAlign: "center", fontSize: 15 }}>No topics followed. Search for a topic and follow to view it here.</div>;
    } else {




      var pagination = null;
      let allTopics = null;
      let pageTopics = []; // topics to show on this page number

      let pageNumbers = Math.floor(this.state.topicsFollowed.length / 5) + 1;
      pagination = <Pagination defaultPageSize={1} defaultCurrent={1} total={pageNumbers} onChange={this.handlePageNumberClick} />;
      allTopics = this.state.topicsFollowed;
      let thisPageLast = this.state.pagenumber * 5;
      for (var i = thisPageLast - 5; i < thisPageLast; i++) {
        if (allTopics[i] !== undefined) {
          pageTopics[i] = allTopics[i];
        }
      }




      displayedResults = pageTopics.map(key => (
        <div style={{ textAlign: "center" }}>
          <div className="card" style={{ width: "70%", height: 100, textAlign: "center" }}>
            <div className="card-body">
              <h5 className="card-title" style={{ fontSize: 15, marginLeft: 20, marginTop: 20 }}>
                <href to="#" onClick={() => { this.handleTopicLinkClick(key) }}><font color="#6495ED">{key.title}</font></href>
              </h5>
              <br />

              <Button size="small" icon="close-circle" shape="round" onClick={() => this.handleUnfollow(key._id)}>
                Unfollow
                  </Button>

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
              <b>Topics followed:</b>
            </font>
            <br />
            <br />
            {displayedResults}
          </div>
          <br />
          <br />
          <div style={{ textAlign: "center" }}>{pagination}</div>
        </Card>
      </div>
    );
  }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) { }
export default connect(mapStateToProps)(Topics);
