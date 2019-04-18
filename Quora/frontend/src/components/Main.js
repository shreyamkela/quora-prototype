import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from './Login/Login';
import Signup from './SignUp/Signup';
import Navbar from './LandingPage/Navbar';

//Create a Main Component
class Main extends Component {
    render() {
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={Login} />
                <Route  path="/main" component={Navbar} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup}/>
            </div>
        )
    }
}
//Export The Main Component
export default Main;