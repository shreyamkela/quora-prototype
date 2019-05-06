import React, {Component} from 'react'
import {Card} from 'antd';
import {connect} from 'react-redux';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { List,Radio, Select }  from 'antd';
import _ from "lodash";
import { fetchUserActivity } from "../../actions";
import "./SideMenu.css";

const RadioGroup = Radio.Group;
const Option = Select.Option;


class UserContent extends Component {

    constructor() {
        super()
        this.state = {
          activities: [],
          showAsked:false,
          showAnswered:false,
          showFollowed:false,
          showAllTypes:true,
          rvalue:1,
          yearvalue:''
       //   timestamp: '',
        //  question_id: ''
        }
        this.onChange = this.onChange.bind(this)
        this.onAllTypes = this.onAllTypes.bind(this)
        this.onQuestionsAsked = this.onQuestionsAsked.bind(this)
        this.onQuestionsFollowed = this.onQuestionsFollowed.bind(this)
        this.onQuestionsAnswered = this.onQuestionsAnswered.bind(this)
        this.handleChange = this.handleChange.bind(this)
   //     this.onNewestFirst = this.onNewestFirst.bind(this)
    //    this.onYear2018 = this.onYear2018.bind(this)
     //   this.onYear2019 = this.onYear2019.bind(this)
   
    }

    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
          rvalue: e.target.value,
        });
      }

      handleChange = (value) => {
        this.setState({
            yearvalue: value,
          });
      }

    onAllTypes(e) {
        this.setState({
            showAllTypes:true,
          showAsked:false,
          showFollowed:false,
          showAnswered:false
        });
    }


    onQuestionsAsked(e) {
        this.setState({
            showAllTypes:false,
          showAsked:true,
          showFollowed:false,
          showAnswered:false
        });
    }
    onQuestionsFollowed(e) {
        this.setState({
            showAllTypes:false,
          showFollowed:true,
          showAnswered:false,
          showAsked:false
        });
    }
    onQuestionsAnswered(e) {
        this.setState({
            showAllTypes:false,
          showAnswered:true,
          showFollowed:false,
          showAsked:false
    
        });
    }

  componentDidMount() {
    //console.log("Did Mount")
    this.props.fetchUserActivity()

    console.log("activites :" + JSON.stringify((this.props.userActivities)))

  }
   

    render() {
        if(!cookie.load('cookie_user')){
            this.props.history.push("/login");
        }
        const cssClasses = 'side-menu-fixed open';
        console.log("activity array: " + this.state.activities)
        
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
          };

let details = [];

details=_.map(this.props.userActivities, activity => {
    let d = new Date(activity.timestamp)
    return {
        type: activity.type,
        question: activity.question,
        timestamp: activity.timestamp,
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString(),
        year: activity.year
    }
})


    if (this.state.rvalue===2 ) {
        details = details.sort(function compare(a, b) {
            var dateA = new Date(a.timestamp);
            var dateB = new Date(b.timestamp);
            return dateA - dateB;
          });
          
        }
  
        if (this.state.yearvalue=="2018" ) {
            details = details.filter(ans => {
                return   ans.year === 2018  
            } );
        }

        if (this.state.yearvalue=="2019" ) {
            details = details.filter(ans => {
                return   ans.year === 2019  
            } );
        }

    
/*
    if (this.state.showAnswered)
    {
        details = this.state.activities.map(ans => {
        if(ans.type==="You answered")
            return({
                type:  ans.type,
                    question: ans.question,
                    timestamp: ans.timestamp
             } )
            })
        }
*/
        if (this.state.showAsked) {
        details = details.filter(ask => {
            return   ask.type === "You asked"  
        } );
    }




    if (this.state.showAnswered) {
        details = details.filter(ans => {
            return   ans.type === "You answered"  
        } );
    }

    if (this.state.showFollowed) {
        details = details.filter(foll => {
            return   foll.type === "You followed"  
        } );
//followed and newest first
  /*      if (this.state.value===2 ) {
            details = details.sort(function compare(a, b) {
                var dateA = new Date(a.timestamp);
                var dateB = new Date(b.timestamp);
                return dateA - dateB;
              });
              
            } */
    }


    console.log("details array: " + JSON.stringify(details))
  //  console.log("details1 array: " + JSON.stringify(details1))                  

              let redirectVar = null;
              if(!cookie.load('cookie_user'))
                redirectVar = <Redirect to="/login" />
   

        return (
            
            <div>
            <nav className={ cssClasses }>
            <ul>
            
             {/*} <li><MenuItem label='Announcements' link='/announce' icon='fa fa-bullhorn' course={this.props.targetId}/></li>{*/}
             <li> <i className="fa fa-bullhorn"></i><button className="btn btn-link"  type='button' onClick={ this.onAllTypes } >All Types</button> </li>
             <li> <i className="fa fa-bullhorn"></i><button className="btn btn-link"  type='button' onClick={ this.onQuestionsAsked } >Questions Asked</button> </li>
             <li> <i className="fa fa-users"></i><button className="btn btn-link"  type='button' onClick={ this.onQuestionsFollowed } >Questions Followed</button>  </li>
             <li> <i className="fa fa-star"></i><button className="btn btn-link"  type='button' onClick={ this.onQuestionsAnswered } >Answers</button> </li>

             <li> <i className="fa fa-edit"></i> <b>Year </b> </li>
             {/*    <li> <i className="fa fa-edit"></i><button className="btn btn-link" type='button' onClick={ this.onYear2019 } >2018</button>  </li>  */}
             {/*    <li> <i className="fa fa-edit"></i><button className="btn btn-link" type='button' onClick={ this.onYear2019 } >2019</button>  </li>*/}
                  <li><Select defaultValue="All" style={{ width: 120 }} onChange={this.handleChange}>
                  <Option value="2018">2018</Option>
                  <Option value="2019">2019</Option>
                  <Option value="All">All</Option>
                </Select>
                </li>

             <li> <i className="fa fa-edit"></i> <b>Sort Order</b> </li>
             <li>   <RadioGroup onChange={this.onChange} value={this.state.rvalue}>
             <Radio style={radioStyle} value={1}>Newest First</Radio>
           <Radio style={radioStyle} value={2}>Oldest First</Radio>
           </RadioGroup></li>
           {/*     <li> <i className="fa fa-file-pdf-o"></i><button className="btn btn-link" type='button' onClick={ this.onNewestFirst } > Newest First </button>  </li> */}
           {/*     <li> <i className="fa fa-question-circle"></i><button className="btn btn-link"  type='button' onClick={ this.onOldestFirst } > Oldest First </button>  </li> */}
     
          
              </ul>
            </nav>
            <div style={{"margin-left":"140px"}}>
            {redirectVar}
            <font size="4">
            <b>Your Content</b>
          </font>
    
              <List
              itemLayout="horizontal"
            
              dataSource={details}
              renderItem={item => (
                <List.Item>
                {item.type} <b>{item.question}</b>
                  <List.Item.Meta
             
                    description= {item.date + " " + item.time}
                    
                  />
                 
                </List.Item>
              )}
            />
            </div>
              </div>
        )
    }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
    return {
        userActivities: state.userActivities
    };
  }
export default connect(mapStateToProps,{fetchUserActivity})(UserContent);