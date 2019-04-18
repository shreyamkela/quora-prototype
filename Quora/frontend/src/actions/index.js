import axios from "axios";
import cookie from 'react-cookies';

export const CHECK_VALID = "check_valid";
export const CHECK_SIGNUP = "check_signup";
export const LOGOUT = "logout"

const ROOT_URL = "http://localhost:3001";

export function checkValid(values, callback) {
    //middleware call
    //receive response from backend
    axios.defaults.withCredentials = true;
    const response = axios.post(`${ROOT_URL}/login`, values)
      .then((response) => { callback();return response })
      .catch(error => {return error.response})
    //Action dispatched
    console.log("Response",response);
    return {
      type: CHECK_VALID,
      payload: response
    };
  }
  
  export function signUp(values, callback) {
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    const response = axios.post(`${ROOT_URL}/signup`,values)
        .then(response => {
          callback()
          return response
        })
      .catch(error => { return error.response })
    
      return {
        type: CHECK_SIGNUP,
        payload: response
      };
}
  
export function logout() {
    cookie.remove('cookie_user', { path: '/' })
    cookie.remove('cookie_role', { path: '/' })
    cookie.remove('auth_token', { path: '/' })
      return {
        type: LOGOUT,
        payload: false
      };
  }