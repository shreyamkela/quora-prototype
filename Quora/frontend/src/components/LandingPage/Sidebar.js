import React, { Component } from "react";
import { Input, Layout, Menu, Select, message, Avatar } from "antd";
import { Link } from "react-router-dom";
import { Router, Route, Switch } from "react-router-dom";
import Questions from "../Question/Questions";
import Profile from "../Profile/Profile";
import UpdateProfile from "../Profile/UpdateProfile";
import { connect } from "react-redux";
import { logout } from "../../actions";
import cookie from "react-cookies";
import Answers from "../Answers/Answers";
import API from "../../utils/API";
import quoraLogo from "../../utils/documents/images/quora_logo_light.jpg";
import Topics from "../Topics/Topics";
import SearchTopics from "../Search/SearchTopics"
import SearchQuestions from "../Search/SearchQuestions"
import SearchPeople from "../Search/SearchPeople"
import Stats from "../Statistics/Stats"
import Bookmarks from "../Answers/Bookmarks/Bookmarks";
import UserAnswers from "../Answers/UserAnswers/UserAnswers";
import UserContent from "../UserContent/UserContent"
import QuestionsInTopic from "../Topics/QuestionsInTopic"
import Following from "../Following/Following";
import Followers from "../Followers/Followers";


const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;
const Option = Select.Option;

class Sidebar extends Component {
  state = {
    collapsed: false,
    // NOTE - searchType is for the dropdown of the search bar - "Q" is for questions, "T" is for topics, and "P" is for people. Default is "Q"
    searchType: "Q"
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  //handle logout to destroy the cookie
  handleLogout = () => {
    this.props.logout();
  };

  handleSearch = async searchTerm => {
    // console.log(searchTerm);


    // TODO - Handle special character/scripts entered in the search bar at the backend so that the server doesnt crash when the entered term is unusual. Check how quora handles special characters or unusual search terms
    try {
      // Query backend api respective to the search type
      let response = null;
      if (this.state.searchType === "Q") {
        if (searchTerm === "") {
          message.warning("Please enter a search term.");
          return;
        }
        response = await API.get("searchQuestions", { params: searchTerm });
        console.log("Search results: ", response.data);
        this.props.history.push({ // This is how we pass data from this component to a child component i.e searchQuestions, using the history.push. This will change the route, render new component, and also pass data into the component. Passed data can be accessed in the child component through this.props.history.location.state. To pass these props into the child component we have used <Route exact path="/main/questions/search" render={(props) => <SearchQuestions {...props} />} />
          pathname: "/main/questions/search",
          state: {
            searchResults: response.data
          }
        })
        // NOTE - Using this.props.history.push we can change the /main/home to /main/questions/search without refreshing the page. The internal component changes. We dont have to use redux or set state to change the internal component on search to show search results
      } else if (this.state.searchType === "T") {
        if (searchTerm === "") {
          message.warning("Please enter a search term.");
          return;
        }
        response = await API.get("searchTopics", { params: searchTerm });
        console.log("Search results: ", response.data);
        this.props.history.push({ // This is how we pass data from this component to a child component i.e searchTopics, using the history.push. This will change the route, render new component, and also pass data into the component. Passed data can be accessed in the child component through this.props.history.location.state. To pass these props into the child component we have used <Route exact path="/main/topics/search" render={(props) => <SearchTopics {...props} />} />
          pathname: "/main/topics/search",
          state: {
            searchResults: response.data
          }
        })
        // NOTE - Using this.props.history.push we can change the /main/home to /main/topics/search without refreshing the page. The internal component changes. We dont have to use redux or set state to change the internal component on search to show search results
      } else if (this.state.searchType === "P") {
        if (searchTerm === "*") {
          searchTerm = "";
        }
        response = await API.get("searchPeople", { params: searchTerm });
        console.log("Search results: ", response.data);
        this.props.history.push({
          pathname: "/main/people/search",
          state: {
            searchResults: response.data
          }
        })
      }
    } catch (error) {
      console.log(error);
      message.error("Unable to search at the moment. Please refresh the page and try again.");
    }
  };

  handleSearchTypeChange = value => {
    this.setState({ searchType: value });
  };

  render() {
    if (!cookie.load("cookie_user")) {
      this.props.history.push("/login");
    }

    // Dropdown in the search bar to select SearchType
    const selectBefore = (
      <Select
        defaultValue="Questions"
        onSelect={value => {
          this.handleSearchTypeChange(value);
        }}
        style={{ width: 120 }}
      >
        <Option value="Q">Questions</Option>
        <Option value="T">Topics</Option>
        <Option value="P">People</Option>
      </Select>
    );

    return (
      <Layout>
        <Header className="topbar" style={{ background: "#fff" }}>
          <Menu theme="light" mode="horizontal" defaultSelectedKeys={["2"]} style={{ lineHeight: "64px", zIndex: "800" }}>
            <Menu.Item key="0">
              <img src={quoraLogo} style={{ width: 100 }} />
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/main/home">Home</Link>
            </Menu.Item>

            <Menu.Item key="4" style={{ marginLeft: 80, width: 500 }}>
              <Search
                className="Search-Button"
                style={{ marginTop: 18 }}
                placeholder="Search Quora"
                enterButton="Search"
                size="medium"
                onSearch={value => {
                  this.handleSearch(value);
                }}
                addonBefore={selectBefore}
              />
            </Menu.Item>
            {/*<Menu.Item key="5" style={{ marginLeft: 90 }}>*/}
            {/*<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />*/}
            {/*</Menu.Item>*/}
            <Menu.Item key="1" style={{ marginLeft: 90 }}>
              <Link to={"/main/profile/" + cookie.load('cookie_user')}> Profile</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/login" onClick={this.handleLogout}>
                Logout
                </Link>
            </Menu.Item>
          </Menu>
        </Header>

        <Layout style={{ padding: "24px 0", background: "#fafafa" }}>
          <Sider width={200} style={{ background: "#fafafa" }}>
            <Menu mode="inline" defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} style={{ height: "100%" }}>
              {/*Team --- Add your routes over here for each corresponding Tab*/}
              <Menu.Item key="1">
                <Link to="/main/home">Feed</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/main/questions">Questions</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/main/useranswers">Answers</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/main/followers">Followers</Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to="/main/following">Following</Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/main/topics/followed">Topics</Link>
              </Menu.Item>
              <Menu.Item key="7">
                <Link to="/main/bookmarks">Bookmarks</Link>
              </Menu.Item>
              <Menu.Item key="8">
                <Link to="/main/stats">Stats</Link>
              </Menu.Item>
              <Menu.Item key="9">
                <Link to="/main/yourcontent">Your Content</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content style={{ padding: "0 24px", minHeight: 280 }}>
            <div className="larger">
              {/*TEAM ----define your routes here routes that will be shown
                                    when a tab 2is clicked*/}
              <Switch>
                <Route exact path="/main/home" component={Questions} />
                <Route path="/main/profile/updateProfile" component={UpdateProfile} />
                <Route exact path="/main/profile/:user_id" component={Profile} />

                <Route exact path="/main/stats" component={Stats} />
                <Route exact path="/main/bookmarks" component={Bookmarks} />
                <Route exact path="/main/useranswers" component={UserAnswers} />
                <Route exact path="/main/yourcontent" component={UserContent} />
                <Route exact path="/main/topics/followed" component={Topics} />
                <Route exact path="/main/followers" component={Followers} />
                <Route exact path="/main/following" component={Following} />
                {/* <Route exact path="/main/topics" component={Topics} /> This doesnt work therefore added a /followed infront*/}
                <Route exact path="/main/topics/search" render={(props) => <SearchTopics {...props} />} />
                <Route exact path="/main/questions/search" render={(props) => <SearchQuestions {...props} />} />
                <Route exact path="/main/people/search" render={(props) => <SearchPeople {...props} />} />
                <Route exact path="/main/topics/:topic/questions" render={(props) => <QuestionsInTopic {...props} />} />

                <Route exact path="/main/:question_id" component={Answers} />
               
              </Switch>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

//This method is provided by redux and it gives access to centeral store
function mapStateToProps(state) {
  return {
    authFlag: state.authFlag
  };
}
export default connect(
  mapStateToProps,
  { logout }
)(Sidebar);
