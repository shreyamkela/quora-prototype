import { FETCH_ANSWERS} from "../actions";
//import cookie from 'react-cookies';


//Reducer listening to different action types
//initial state is {}
export function fetchAnswersReducer(state = {}, action) {
  switch (action.type) {
    //target 
    case FETCH_ANSWERS:
      return action.payload.data
    default:
      return state;
  }
}



