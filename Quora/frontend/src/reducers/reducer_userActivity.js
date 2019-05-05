import { FETCH_ACTIVITY} from "../actions";
//import cookie from 'react-cookies';


//Reducer listening to different action types
//initial state is {}
export function fetchActivityReducer(state = {}, action) {
  switch (action.type) {
    //target 
    case FETCH_ACTIVITY:
      return action.payload.data
    default:
      return state;
  }
}