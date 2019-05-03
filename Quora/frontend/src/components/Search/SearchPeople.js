import React, { Component } from "react";
import { connect } from "react-redux";

class SearchPeople extends Component {
    render() {
        return <div>AAAAAAAAAAAAAAAAAAAAAAAAAAAAa</div>;
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return {};
}
export default connect(mapStateToProps)(SearchPeople);
