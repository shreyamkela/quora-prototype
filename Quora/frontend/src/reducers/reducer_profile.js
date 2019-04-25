import { FETCH_PROFILE} from "../actions";
//import cookie from 'react-cookies';

const initialState = {
  items: []
}

//Reducer listening to different action types
//initial state is {}
export function profileReducer(state = initialState, action) {
  switch (action.type) {
    //target 
    case FETCH_PROFILE:
      return {
        ...state,
       items: action.payload
      }

    default:
      return state;
  }
}



