import axios from "axios";
import cookie from 'react-cookies';

export const CHECK_VALID = "check_valid";
export const CHECK_SIGNUP = "check_signup";
export const LOGOUT = "logout";
export const UPDATE_PROFILE = "update_profile"
export const FETCH_PROFILE = "fetch_profile"
export const FETCH_ANSWERS = "fetch_answers"
export const ADD_ANSWER = "add_answer"
export const DISPLAY_ADD_ANSWER  = "display_add_answer"
export const ADD_QUESTIONS = "addQuestion"
export const TOP__UP_ANSWERS = "top_up_answers"
export const TOP__DOWN_ANSWERS = "top_down_answers"
export const USER_ANSWERS = "user_answers"
export const COMMENT_ON_ANSWER = "comment_on_answers"
export const BOOKMARK_ANSWER = "bookmark_answer"
export const FETCH_BOOKMARKS = "fetch_bookmarks"
export const FETCH_ACTIVITY = "fetch_activity"
export const FETCH_QUESTIONS = 'fetch_questions'

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


 
 export function fetchProfile(user_id) {
  console.log("accessToken: " + accessToken)
 // axios.post(`${ROOT_URL}/profileupdate`,values,{headers:{'Content-Type': 'application/json','Authorization': `Bearer ${accessToken}`}},callback)
  //set the with credentials to true
  axios.defaults.withCredentials = true;
  //make a post request with the user data
  const response = axios.get(`${ROOT_URL}/profile?email_id=`+user_id)
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
 
export function displayAddAnswerForm(display) {
  return {
    type: DISPLAY_ADD_ANSWER,
    display:display
  }
}

 export function addAnswer(q_id,values, callback) {
  //set the with credentials to true
  axios.defaults.withCredentials = true;
  //make a post request with the user data
   console.log(q_id)
  const response = axios.post(`${ROOT_URL}/answer?question_id=`+q_id,values)
      .then(response => {
        callback()
        return response
      })
    .catch(error => { return error.response })
  
    return {
      type: ADD_ANSWER,
      payload: response
    };
}

export function voteAnswer(a_id, values, callback) {
  //set the with credentials to true
  axios.defaults.withCredentials = true;
  //make a post request with the user data
  console.log(a_id)
  console.log(values)
  const response = axios.post(`${ROOT_URL}/vote?answer_id=`+a_id,values)
      .then(response => {
        callback()
        return response
      })
    .catch(error => { return error.response })
  
    return {
      type: ADD_ANSWER,
      payload: response
    };
}
   

export function addQuestion() {
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    const response = axios.get(`${ROOT_URL}/questions`)
        .then(response =>{
            return response
        })
        .catch(error => { return error.response })

    return {
        type: ADD_QUESTIONS,
        payload: response
    };
}

export function getTopUpAnswers() {
  axios.defaults.withCredentials = true;
    //make a post request with the user data
    const response = axios.get(`${ROOT_URL}/topupanswers`)
        .then(response =>{
            return response
        })
        .catch(error => { return error.response })

    return {
        type: TOP__UP_ANSWERS,
        payload: response
    };
}
 
export function getTopDownAnswers() {
  axios.defaults.withCredentials = true;
    //make a post request with the user data
    const response = axios.get(`${ROOT_URL}/topdownanswers`)
        .then(response =>{
            return response
        })
        .catch(error => { return error.response })

    return {
        type: TOP__DOWN_ANSWERS,
        payload: response
    };
}
 

export function fetchUserAnswers() {
  axios.defaults.withCredentials = true;
    //make a post request with the user data
    const response = axios.get(`${ROOT_URL}/useranswers`)
        .then(response =>{
            return response
        })
        .catch(error => { return error.response })

    return {
        type: USER_ANSWERS,
        payload: response
    };
}

export function commentOnAnswer(a_id,values, callback) {
  //set the with credentials to true
  axios.defaults.withCredentials = true;
  //make a post request with the user data
  console.log(values)
  const response = axios.post(`${ROOT_URL}/comment?answer_id=` + a_id, { comment: values })
      .then(response => {
        callback()
        return response
      })
    .catch(error => { return error.response })
  
    return {
      type: COMMENT_ON_ANSWER,
      payload: response
    };
}

export function bookmarkAnAnswer(a_id, callback) {
  //set the with credentials to true
  axios.defaults.withCredentials = true;
  //make a post request with the user data
  const response = axios.post(`${ROOT_URL}/bookmark?answer_id=` + a_id)
      .then(response => {
        callback()
        return response
      })
    .catch(error => { return error.response })
  
    return {
      type: BOOKMARK_ANSWER,
      payload: response
    };
}

export function fetchBookmarkedAnswers() {
  axios.defaults.withCredentials = true;
    //make a post request with the user data
    const response = axios.get(`${ROOT_URL}/bookmark`)
        .then(response =>{
            return response
        })
        .catch(error => { return error.response })

    return {
        type: FETCH_BOOKMARKS,
        payload: response
    };
}

export function editAnswer(a_id,values, callback) {
  //set the with credentials to true
  axios.defaults.withCredentials = true;
  //make a post request with the user data
  const response = axios.post(`${ROOT_URL}/updateanswer?answer_id=`+a_id,values)
      .then(response => {
        callback()
        return response
      })
    .catch(error => { return error.response })
  
    return {
      type: ADD_ANSWER,
      payload: response
    };
}

export function fetchUserActivity() {
  axios.defaults.withCredentials = true;
    //make a post request with the user data
    const response = axios.get(`${ROOT_URL}/activity`)
        .then(response =>{
            return response
        })
        .catch(error => { return error.response })

    return {
        type: FETCH_ACTIVITY,
        payload: response
    };
}


export function fetchQuestions() {
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    const response = axios.get(`${ROOT_URL}/fetchQuestions`)
        .then(response =>{
            return response
        })
        .catch(error => { return error.response })

    return {
        type: FETCH_QUESTIONS,
        payload: response
    };
}