import axios from "axios";
import cookie from 'react-cookies';

export const CHECK_VALID = "check_valid";
export const CHECK_SIGNUP = "check_signup";
export const LOGOUT = "logout";
export const UPDATE_PROFILE = "update_profile"
export const FETCH_PROFILE = "fetch_profile"
export const FETCH_ANSWERS = "fetch_answers"
const ROOT_URL = "http://localhost:3001";

var accessToken = localStorage.getItem('auth_token')

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
    console.log("values in signup:" + values)
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

  export function updateProfile(values,callback) {
    console.log("accessToken: " + accessToken)
   // axios.post(`${ROOT_URL}/profileupdate`,values,{headers:{'Content-Type': 'application/json','Authorization': `Bearer ${accessToken}`}},callback)
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    const response = axios.post(`${ROOT_URL}/profile`,values)
      .then(response =>{
        console.log("response status in updprf action : " + response.status + JSON.stringify(response.data))
        callback()
        return response
      })
    .catch(error => { return error.response })
  
    return {
      type: UPDATE_PROFILE,
      payload: response.status
    };
}


 
 export function fetchProfile() {
  console.log("accessToken: " + accessToken)
 // axios.post(`${ROOT_URL}/profileupdate`,values,{headers:{'Content-Type': 'application/json','Authorization': `Bearer ${accessToken}`}},callback)
  //set the with credentials to true
  axios.defaults.withCredentials = true;
  //make a post request with the user data
  const response = axios.get(`${ROOT_URL}/profile`)
    .then(response =>{
      console.log("response status in display profile action : " + response.status + JSON.stringify(response.data))
      return response
    })
  .catch(error => { return error.response })

  return {
    type: FETCH_PROFILE,
    payload: response
  };
 }

 export function fetchAnswersByQID(q_id) {
  axios.defaults.withCredentials = true;
  //make a post request with the user data
  console.log(q_id)
  const response = axios.get(`${ROOT_URL}/answer?question_id=`+q_id)
    .then(response =>{
      return response
    })
  .catch(error => { return error.response })

  return {
    type: FETCH_ANSWERS,
    payload: response
  };
 }
 
       
    