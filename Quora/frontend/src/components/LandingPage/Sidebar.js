import React, {Component} from 'react';
import {
    Layout, Menu
} from 'antd';
import {Link} from 'react-router-dom';
import {Router, Route} from 'react-router-dom';
import Questions from '../Question/Questions';
import Profile from '../Profile/Profile';
import UpdateProfile from '../Profile/UpdateProfile';
import { connect } from "react-redux";
import { logout } from "../../actions";
import cookie from 'react-cookies';

const {SubMenu} = Menu;
const {
    Header, Content, Footer, Sider,
} = Layout;


class Sidebar extends Component {

    state = {
        collapsed: false,
    };

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({collapsed});
    }

    //handle logout to destroy the cookie
    handleLogout = () => {
        this.props.logout()
    }

    render() {
        if(!cookie.load('cookie_user')){
            this.props.history.push("/login");
        }
        return (
            <div>
                <Layout>
                    <Header className="header">
                        <div className="logo"/>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            style={{lineHeight: '64px'}}
                        >
                            <Menu.Item key="1"> <Link to='/main/profile'> Profile</Link></Menu.Item>
                            <Menu.Item key="2"> <Link to='/main/home'>Home</Link></Menu.Item>
                            <Menu.Item key="3"> <Link to='/login' onClick={this.handleLogout}>Logout</Link></Menu.Item>
                        </Menu>
                    </Header>
                    {/*<div className='sidenav'>*/}
                    {/*<h3>SJSU</h3>*/}
                    {/*<ul className="nav nav-pills nav-stacked">*/}
                    {/*<li className={accountClass}><Link to="/main/profile" ><i className="fa fa-circle-o"></i> Profile</Link></li>*/}
                    {/*<li className={homeClass}><a href="/main/home">Home</a></li>*/}
                    {/*<li className={settingsClass}><a href="/main/settings">Settings</a></li>*/}
                    {/*{navLogin}*/}
                    {/*</ul>*/}
                    {/*</div>*/}

                    <Content style={{padding: '0 50px'}}>
                        <Layout style={{padding: '24px 0', background: '#fff'}}>
                            <Sider width={200} style={{background: '#fff'}}>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['sub1']}
                                    style={{height: '100%'}}
                                >
                                    {/*Team --- Add your routes over here for each corresponding Tab*/}
                                    <Menu.Item key="1"><Link to=''>Home</Link></Menu.Item>
                                    <Menu.Item key="2"><Link to='/questions'>Questions</Link></Menu.Item>
                                    <Menu.Item key="3"><Link to=''>Answers</Link></Menu.Item>
                                    <Menu.Item key="4"><Link to=''>Followers</Link></Menu.Item>
                                    <Menu.Item key="5"><Link to=''>Following</Link></Menu.Item>
                                    <Menu.Item key="6"><Link to=''>Topics</Link></Menu.Item>
                                    <Menu.Item key="7"><Link to=''>Bookmarks</Link></Menu.Item>


                                    {/*<SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>*/}
                                    {/*<Menu.Item key="9">option9</Menu.Item>*/}
                                    {/*<Menu.Item key="10">option10</Menu.Item>*/}
                                    {/*<Menu.Item key="11">option11</Menu.Item>*/}
                                    {/*<Menu.Item key="12">option12</Menu.Item>*/}
                                    {/*</SubMenu>*/}
                                </Menu>
                            </Sider>
                            <Content style={{padding: '0 24px', minHeight: 280}}>
                                <div className="heading">
                                    <h2>Welcome to Quora!</h2>
                                </div>
                                <div className="larger">
                                    {/*TEAM ----define your routes here routes that will be shown
                                    when a tab is clicked*/}
                                    <Route exact path='/questions' component={Questions}/>
                                    <Route exact path='/main/profile' component={Profile}/>
                                    <Route path="/main/profile/updateProfile" component={UpdateProfile}/>
                                </div>
                            </Content>
                        </Layout>
                    </Content>
                </Layout>

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
export default connect(mapStateToProps,{ logout })(Sidebar);