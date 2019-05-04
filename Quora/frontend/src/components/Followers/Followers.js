import React, { Component } from "react";
import cookie from "react-cookies";
import {connect} from "react-redux";


class Followers extends Component{

    render(){
        return(
            <div>

            </div>
        )
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return;
}
export default connect(mapStateToProps)(Followers);
