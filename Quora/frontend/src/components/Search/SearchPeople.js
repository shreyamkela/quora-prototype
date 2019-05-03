import React, { Component } from "react";
import { connect } from "react-redux";
import { Card } from "antd"

class SearchPeople extends Component {
    render() {
        // To access the state passed into this component from parent through this.props.history.push - we use this.props.history.location.state
        console.log("SearchPeople component: ", this.props.history.location.state)
        let searchResults = null;
        if (this.props.history.location.state.searchResults !== undefined) {
            searchResults = this.props.history.location.state.searchResults
        }
        return <div><Card>Search People:</Card></div>;
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return {};
}
export default connect(mapStateToProps)(SearchPeople);
