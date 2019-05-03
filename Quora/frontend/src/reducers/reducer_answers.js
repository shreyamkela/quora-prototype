import { FETCH_ANSWERS, ADD_ANSWER} from "../actions";
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