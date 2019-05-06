import { FETCH_ANSWERS,FETCH_QUESTIONS, ADD_ANSWER, DISPLAY_ADD_ANSWER, TOP__UP_ANSWERS, TOP__DOWN_ANSWERS, USER_ANSWERS, FETCH_COMMENTS, COMMENT_ON_ANSWER, BOOKMARK_ANSWER, FETCH_BOOKMARKS} from "../actions";
//import cookie from 'react-cookies';


//Reducer listening to different action types
//initial state is {}
export function fetchAnswersReducer(state = {}, action) {
  switch (action.type) {
    //target 
    case FETCH_ANSWERS:
      return action.payload.data
    case ADD_ANSWER:
      return state
    default:
      return state;
  }
}

export function displayAddAnswerFormReducer(state = false, action) {
  switch (action.type) {
    //target 
    case DISPLAY_ADD_ANSWER:
      return action.display
    default:
      return state
  }
}

export function fetchTopUpAnswersReducer(state = [], action) {
  switch (action.type) {
    //target 
    case TOP__UP_ANSWERS:
      return action.payload.data
    default:
      return state
  }
}

export function fetchTopDownAnswersReducer(state = [], action) {
  switch (action.type) {
    //target 
    case TOP__DOWN_ANSWERS:
      return action.payload.data
    default:
      return state
  }
}

export function fetchUserAnswersReducer(state = [], action) {
    switch (action.type) {
        //target
        case USER_ANSWERS:
            return action.payload.data
        default:
            return state
    }
}

export function fetchUserQuestionsReducer(state = [], action) {
    switch (action.type) {
        //target
        case FETCH_QUESTIONS:
            return action.payload.data
        default:
            return state
    }
}

export function fetchBookmarksReducer(state = [], action) {
  switch (action.type) {
    //target 
    case FETCH_BOOKMARKS:
      return action.payload.data
    case BOOKMARK_ANSWER:
      return state
    default:
      return state
  }
}
