import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Card, Row, Col, message, Avatar } from "antd";
import cookie from "react-cookies";
import Pagination from 'react-bootstrap/Pagination'
import API from "../../utils/API";

class FollowingList extends Component {

  constructor() {
    super();
    this.state = {
      following: "NO_FOLLOWING_YET",
      currentPage: 1,
      todosPerPage: 5,
    }

  }

  async componentWillMount() {
    let data = { my_email: cookie.load("cookie_user") }
    console.log(data);
    // GET topicsFollowed backend route is being used here to follow if not already followed. GET topicsFollowed backend route is being used in the Topics.js frontend to GET all topics followed by this user. They type property in data determines which frontend component is calling /topicsFollowed 
    let response = null;
    try {
      response = await API.post("fetchfollowing", data);
      console.log("Response on following: " + JSON.stringify(response.data))
      if (response.data.success) {
        this.setState({
          following: response.data.following
        });

      } else {

        message.error("Unable to get following list")

      }
    } catch (error) {
      console.log(error);
      message.error("Unable to get following list")
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

    let searchResults = "NO_FOLLOWING_YET";
    if (this.state.following !== "NO_FOLLOWEING_YET" && this.state.following != null && this.state.following.length !== 0 && this.state.following !== undefined) {
      searchResults = this.state.following
    }
    let displayedResults = null;
    let paginationBasic = null;
    let currentTodos = null;
    if (searchResults === "NO_FOLLOWING_YET" || searchResults === null || searchResults.length === 0 || searchResults[0] === undefined) {
      displayedResults = <div style={{ textAlign: "center", fontSize: 15 }}>No Followings Yet.</div>;
      currentTodos = <div style={{ textAlign: "center", fontSize: 15 }}>No Followings Yet.</div>;
    } else {
      displayedResults = searchResults.map(key => (
        <div style={{ textAlign: "center" }}>
          <div className="card" style={{ width: "70%", height: 100, textAlign: "center" }}>
            <div className="card-body">
              <h5 className="card-title" style={{ fontSize: 15, marginLeft: 20, marginTop: 20 }}>
                <Avatar src={key.photo} /> 
                <href to="#" onClick={() => { this.handleProfileLinkClick(key) }}><font color="#6495ED">{" "} {key.firstname} {key.lastname}</font></href>

              </h5>
              <Button size="small" icon="close-circle" shape="round" onClick={() => this.handleUnfollow(key.email)}>
                Unfollow
                      </Button>
            </div>
          </div>
          <br />
          <br />
        </div>
      ));

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
              <b>Following:</b>
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
export default connect(mapStateToProps)(FollowingList);
