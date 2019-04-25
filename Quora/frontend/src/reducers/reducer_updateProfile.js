import { UPDATE_PROFILE} from "../actions";
import cookie from 'react-cookies';


//Reducer listening to different action types
//initial state is {}
export function updateProfileReducer(state =(cookie.load('cookie_user')!==undefined), action) {
  switch (action.type) {
    //target 

      case UPDATE_PROFILE:
      console.log("prof update status " + action.payload)
      return  {
        status: action.payload
      }

    default:
      return state;
  }
}

