import React, {Component} from 'react'
import {Card} from 'antd';
import {connect} from 'react-redux';
import cookie from 'react-cookies';
import _ from "lodash";
import ReactChartkick, { PieChart, ColumnChart } from 'react-chartkick'
import Chart from 'chart.js'
import { getTopDownAnswers,getTopUpAnswers} from "../../actions";

ReactChartkick.addAdapter(Chart)
const {Meta} = Card;


class Stats extends Component {


    //get the announcements data from backend  
    componentDidMount() {
        console.log("Mounting")
        this.props.getTopUpAnswers()
        this.props.getTopDownAnswers()
    }

    getUpVoteData = () => {
        let data = {}
        _.map(this.props.topUpAnswers, answer => {
            data[answer.content]=answer.upvotes
         })
        console.log(data)
        return data
    }

    getDownVoteData = () => {
        let data = {}
        _.map(this.props.topDownAnswers, answer => {
            data[answer.content]=answer.downvotes
         })
        console.log(data)
        return data
    }

    columnupchart = () => {
        return <ColumnChart data={this.getUpVoteData()} width="400px" height="300px" />
    }

    columndownchart = () => {
        return <ColumnChart data={this.getDownVoteData()} width="400px" height="300px" />
    }

    piechart = () => {
        return <PieChart data={[["Blueberry", 44], ["Strawberry", 23],["Apple",0]]} width="300px" height="300px"/>
    }
    render() {
        if(!cookie.load('cookie_user')){
            this.props.history.push("/login");
        }
        return (
            <div>
                
                <div>
                    <div className="wrapper">
                        {this.columnupchart()}
                        {this.columndownchart()}
                        {this.piechart()}
                    </div>
                </div>
            </div>
        )
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return {
        authFlag: state.authFlag,
        topUpAnswers: state.topUpAnswers,
        topDownAnswers:state.topDownAnswers
    };
  }
export default connect(mapStateToProps,{getTopDownAnswers,getTopUpAnswers})(Stats);