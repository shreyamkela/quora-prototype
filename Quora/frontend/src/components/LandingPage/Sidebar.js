import React, { Component } from "react";
import { Input, Layout, Menu, Select, message } from "antd";
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
    if (searchTerm === "") {
      message.warning("Please enter a search term.");
      return;
    }

    // TODO - Handle special character/scripts entered in the search bar at the backend so that the server doesnt crash when the entered term is unusual. Check how quora handles special characters or unusual search terms
    try {
      // Query backend api respective to the search type
      let response = null;
      if (this.state.searchType === "Q") {
        response = await API.get("searchQuestions", { params: searchTerm });
        message.success(response.data);
      } else if (this.state.searchType === "T") {
        response = await API.get("searchTopics", { params: searchTerm });
        message.success(response.data);
      } else if (this.state.searchType === "P") {
        response = await API.get("searchPeople", { params: searchTerm });
        message.success(response.data);
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

            <Menu.Item key="1" style={{ marginLeft: 90 }}>
              <Link to="/main/profile"> Profile</Link>
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
                <Link to="">Home</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/main/questions">Questions</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="">Answers</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="">Followers</Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to="">Following</Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/main/topics/followed">Topics</Link>
              </Menu.Item>
              <Menu.Item key="7">
                <Link to="">Bookmarks</Link>
              </Menu.Item>

            </Menu>
          </Sider>
          <Content style={{ padding: "0 24px", minHeight: 280 }}>
            <div className="larger">
              {/*TEAM ----define your routes here routes that will be shown
                                    when a tab 2is clicked*/}
              <Switch>
                <Route exact path="/main/home" component={Questions} />
                <Route exact path="/main/profile" component={Profile} />
                <Route path="/main/profile/updateProfile" component={UpdateProfile} />
                <Route exact path="/main/:question_id" component={Answers} />
                <Route exact path="/main/topics/followed" component={Topics} />
                {/* <Route exact path="/main/topics" component={Topics} /> This doesnt work therefore added a /followed infront*/}
                <Route exact path="/main/topics/search" component={SearchTopics} />
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
