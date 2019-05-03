import React, { Component } from "react";
import { connect } from "react-redux";
import { Card } from "antd";

class SearchTopics extends Component {
  render() {
    // To access the state passed into this component from parent through this.props.history.push - we use this.props.history.location.state
    console.log("SearchTopics component: ", this.props.history.location.state);
    let searchResults = this.props.history.location.state.searchResults;
    let displayedResults = null;
    if (searchResults[0] === undefined) {
      displayedResults = <div style={{ textAlign: "center", fontSize: 15 }}>No topics found for this search.</div>;
    } else {
      displayedResults = searchResults.map(key => (
        <div style={{ textAlign: "center" }}>
          <div className="card" style={{ width: "70%", height: 100 }}>
            <div className="card-body">
              <h5 className="card-title" style={{ fontSize: 15, marginLeft: 20, marginTop: 20 }}>
                {key.title}
              </h5>
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
