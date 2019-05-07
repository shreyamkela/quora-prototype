import React, {Component} from 'react'
import {Card} from 'antd';
import {connect} from 'react-redux';
import cookie from 'react-cookies';
import _ from "lodash";
import ReactChartkick, {ColumnChart } from 'react-chartkick'
import Chart from 'chart.js'
import { getTopDownAnswers,getTopUpAnswers} from "../../actions";
import API from "../../utils/API";
import { message } from "antd";

ReactChartkick.addAdapter(Chart)
const {Meta} = Card;


class Stats extends Component {

    constructor(){
        super();
        this.state = {  
           views : []
        }
		
    }  

    componentWillMount() {
        this.getLast30Views()

    }
    //get the announcements data from backend  
    componentDidMount() {
        console.log("Mounting")
        this.props.getTopUpAnswers()
        this.props.getTopDownAnswers()
        
    }

    async getLast30Views() {
        var i;
        var numViews = [];
        var totalViewsLast = 0;
        var totalViewsCurrent = 0;

        for (i = 1; i <= 30; i++) {
            let response = null;
            let data = { my_email: cookie.load("cookie_user"), day : i}
            console.log(data);
            
            let viewsThisDay = 0;
            numViews[i-1] = 0;
            try {
                response = await API.post("fetchviews", data);
                console.log("Response on fetchviews for day "+i+" : " + JSON.stringify(response.data))
                if (response.data.success) {
                    totalViewsCurrent = response.data.count;
                    viewsThisDay = totalViewsCurrent - totalViewsLast;
                    numViews[i-1] = viewsThisDay;

                    console.log("viewsThisDay on Day"+i+" : "+viewsThisDay)
                    console.log("totalViewsLast on Day"+i+" : "+totalViewsLast)

                    totalViewsLast = response.data.count;
           
                } else {

                    console.log("Unable to fetch Views On Day: "+i);

                }
            } catch (error) {
                console.log(error);
                message.error("Unable to get fetchviews")
            }

        }

        this.setState({
            views : numViews
        });
    }

    getUpVoteData = () => {
        let data = {}
        _.map(this.props.topUpAnswers, answer => {
            data[answer.question]=answer.upvotes
         })
        console.log(data)
        return data
    }

    getDownVoteData = () => {
        let data = {}
        _.map(this.props.topDownAnswers, answer => {
            data[answer.question]=answer.downvotes
         })
        console.log(data)
        return data
    }

    getViewsData = () => {
        let data = {}
        this.state.views.map((count,index) => {
            data[index]= count;
         })
        console.log(data)
        return data
    }

    columnupchart = () => {
        return <ColumnChart data={this.getUpVoteData()} width="400px" height="300px" label='Votes' xtitle='Question Answered' ytitle="Upvote Count"/>
    }

    columndownchart = () => {
        return <ColumnChart data={this.getDownVoteData()} width="400px" height="300px" label='Votes' xtitle='Question Answered' ytitle="Downvote Count"/>
    }

    profileviewchart = () => {
        return <ColumnChart data={this.getViewsData()} width="400px" height="300px" label='Views' xtitle='Last 30 Days (Day0 is today)' ytitle="Profile View Count"/>
    }
    render() {
        if(!cookie.load('cookie_user')){
            this.props.history.push("/login");
        }
        console.log("Views Array: "+JSON.stringify(this.state.views))
        return (
            <div>
                
                <div>
                    <div className="wrapper">
                        {this.columnupchart()}
                        {this.columndownchart()}
                        {this.profileviewchart()}
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