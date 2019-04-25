import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import { connect } from "react-redux";
import { logout } from "../../actions";

//create the Navbar Component
class Navbar extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        this.props.logout()
    }

    render(){
        //if Cookie is set render Logout Button
        let navLogin = null;
        if(!cookie.load('cookie_user')){
            this.props.history.push("/login");
        }
        else {
            //Else display login button
            console.log("Able to read cookie");
            if (window.location.pathname === "/main" || window.location.pathname === "/main/") {
                this.props.history.push("/main/home");
            }
            navLogin = (
                <li className="nav-item"><Link className="nav-link" to="/login" onClick = {this.handleLogout}><span className="glyphicon glyphicon-user"></span>Logout</Link></li>
            )
        }
        const homeClass = window.location.pathname.includes("/main/home") ? "active" : "";
        const accountClass = window.location.pathname.includes("/main/profile") ? "active" : "";
        const settingsClass = window.location.pathname.includes("/main/settings") ? "active" : "";

        return (
            
            <div>
                <div className='sidenav'>
                    <h3>SJSU</h3>
                    <ul className="nav nav-pills nav-stacked">
                        <li className={accountClass}><Link to="/main/profile" ><i className="fa fa-circle-o"></i> Profile</Link></li>
                        <li className={homeClass}><a href="/main/home">Home</a></li>
                        <li className={settingsClass}><a href="/main/settings">Settings</a></li>
                    {navLogin}    
                    </ul>
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
export default connect(mapStateToProps,{ logout })(Navbar);