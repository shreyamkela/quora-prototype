import React, { Component } from "react";
import { connect } from "react-redux";

class SearchTopics extends Component {
  render() {
    return <div>Search Topics:</div>;
  }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(SearchTopics);
