import React, { Component } from "react";
import { connect } from "react-redux";
import { Card } from "antd"

class SearchQuestions extends Component {
    render() {
        return <div><Card>Search Questions:</Card></div>;
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return {};
}
export default connect(mapStateToProps)(SearchQuestions);
