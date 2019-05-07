import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Card, Row, Col, message, Avatar } from "antd";
import cookie from "react-cookies";
import Pagination from 'react-bootstrap/Pagination'
import API from "../../utils/API";

class SearchPeople extends Component {

  constructor() {
    super();
    this.state = {
      currentPage: 1,
      todosPerPage: 5,
    }

  }

  handleSelect(number) {
    console.log('page clicked', number.target.id);
    this.setState({ currentPage: number.target.id });

  }

  handleProfileLinkClick = (key) => {
    this.props.history.push({ // This is how we pass data from this component to a child component i.e searchQuestions, using the history.push. This will change the route, render new component, and also pass data into the component. Passed data can be accessed in the child component through this.props.history.location.state. To pass these props into the child component we have used <Route exact path="/main/questions/search" render={(props) => <SearchQuestions {...props} />} />
      pathname: `/main/profile/${key.email}`,
    })
  }



  async handleFollow(email) {
    console.log(email)

    try {
      let data = { my_email: cookie.load("cookie_user"), target_email: email }
      console.log(data);
      // GET topicsFollowed backend route is being used here to follow if not already followed. GET topicsFollowed backend route is being used in the Topics.js frontend to GET all topics followed by this user. They type property in data determines which frontend component is calling /topicsFollowed 
      let response = null;
      response = await API.post("follow", data);
      console.log("Response on follow: " + JSON.stringify(response))
      if (!response.data.success && response.data.already) {
        message.error("Person Already Followed!")
      } else if (response.data.success && !response.data.already) {
        message.success("Person Followed!")
      } else {
        message.error("Unable to follow person at the moment. Please refresh the page and try again.")
      }
    } catch (error) {
      console.log(error);
      message.error("Unable to follow person at the moment. Please refresh the page and try again.")
    }

  }

  async handleUnfollow(email) {
    console.log(email)
    try {
      let data = { my_email: cookie.load("cookie_user"), target_email: email }
      let response = null;
      response = await API.post("unfollow", data);
      console.log("Response on unfollow: " + JSON.stringify(response))
      if (!response.data.success && response.data.already) {
        message.error("Not Following Person. Can't Unfollow!")
      } else if (response.data.success && !response.data.already) {
        message.success("Person Unfollowed!")
      } else {
        message.error("Unable to unfollow person at the moment. Please refresh the page and try again.")
      }
    } catch (error) {
      console.log(error);
      message.error("Unable to unfollow person at the moment. Please refresh the page and try again.")
    }

  }

  render() {
    // To access the state passed into this component from parent through this.props.history.push - we use this.props.history.location.state
    console.log("SearchPeople component: ", this.props.history.location.state);
    let searchResults = null;
    if (this.props.history.location.state.searchResults != undefined) {
      searchResults = this.props.history.location.state.searchResults
    }
    let displayedResults = null;
    let paginationBasic = null;
    let currentTodos = null;
    if (searchResults === "NO_SUCH_PERSON" || searchResults === null || searchResults.length === 0 || searchResults[0] === undefined) {
      displayedResults = <div style={{ textAlign: "center", fontSize: 15 }}>No person found for this search.</div>;
      currentTodos = <div style={{ textAlign: "center", fontSize: 15 }}>No person found for this search.</div>;
    } else {
      displayedResults = searchResults.map(key => {

        var options = null;

        if (cookie.load("cookie_user") !== key.email) {

          options = <Row style={{ marginLeft: 205 }}>
            <Col span={6}>
              <Button size="small" icon="check-circle" shape="round" onClick={() => this.handleFollow(key.email)} >
                Follow
                </Button>
            </Col>
            <Col span={6}>
              <Button size="small" icon="close-circle" shape="round" onClick={() => this.handleUnfollow(key.email)}>
                Unfollow
                </Button>
            </Col>
          </Row>
        }

        return (
          <div style={{ textAlign: "center" }}>
            <div className="card" style={{ width: "70%", height: 100, textAlign: "center" }}>
              <div className="card-body">
                <h5 className="card-title" style={{ fontSize: 15, marginLeft: 20, marginTop: 20 }}>
                  <Avatar src={key.photo} />
                  <href to="#" onClick={() => { this.handleProfileLinkClick(key) }}><font color="#6495ED">{"  "} {key.firstname} {key.lastname}</font></href>
                </h5>
                {options}

              </div>
            </div>
            <br />
            <br />
          </div>
        )
      });

      // Logic for displaying current todos
      const indexOfLastTodo = this.state.currentPage * this.state.todosPerPage;
      const indexOfFirstTodo = indexOfLastTodo - this.state.todosPerPage;
      currentTodos = displayedResults.slice(indexOfFirstTodo, indexOfLastTodo);

      // Logic for displaying page numbers
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(displayedResults.length / this.state.todosPerPage); i++) {
        pageNumbers.push(i);
      }

      let items = [];
      for (let number = 1; number <= pageNumbers.length; number++) {
        items.push(
          <Pagination.Item key={number} id={number} value={number} active={number == this.state.currentPage} onClick={this.handleSelect.bind(this)}>
            {number}
          </Pagination.Item>,
        );
      }

      paginationBasic = (
        <div>
          <Pagination
            size="sm">{items}
          </Pagination>
          <br />
        </div>
      );


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
            {currentTodos}
            <div class="container-fluid" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {paginationBasic}
            </div>
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
export default connect(mapStateToProps)(SearchPeople);
