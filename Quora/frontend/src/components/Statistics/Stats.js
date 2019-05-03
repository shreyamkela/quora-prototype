import React, {Component} from 'react'
import {Card,Avatar} from 'antd';
import {connect} from 'react-redux';
import cookie from 'react-cookies';
import _ from "lodash";
//import { Chart } from "react-charts";
import ReactChartkick, { LineChart, PieChart, ColumnChart } from 'react-chartkick'
import Chart from 'chart.js'

ReactChartkick.addAdapter(Chart)
const {Meta} = Card;


class Stats extends Component {


    //get the announcements data from backend  
    componentDidMount() {
        console.log("Mounting")
    }

    columnchart = () => {
        return <ColumnChart data={{"A": 2, "B": 5}} width="400px" height="300px" />
    }
    piechart = () => {
        return <PieChart data={[["Blueberry", 44], ["Strawberry", 23]]} width="300px" height="300px"/>
    }
    render() {
        if(!cookie.load('cookie_user')){
            this.props.history.push("/login");
        }
        return (
            <div>
                
                <div>
                    <div className="wrapper">
                        {this.columnchart()}
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
        authFlag: state.authFlag
    };
  }
export default connect(mapStateToProps)(Stats);