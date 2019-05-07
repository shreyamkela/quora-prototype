import { CHECK_VALID ,CHECK_SIGNUP,LOGOUT} from "../actions";
import cookie from 'react-cookies';

//Reducer listening to different action types
//initial state is {}
export function loginReducer(state = '', action) {
  switch (action.type) {
    //target 
    case CHECK_VALID:
    if (action.payload === undefined || action.payload.data === undefined)
      return state
    if (action.payload.status === 200)
      cookie.save('cookie_user',decodeURIComponent(action.payload.data.message), { path: '/' })
      return action.payload.data.message;
    case LOGOUT:
      return ''
    default:
      return state;
  }
}

export function signupReducer(state = '', action) {
  switch (action.type) {
    //target 
    case CHECK_SIGNUP:
     if (action.payload === undefined || action.payload.data === undefined)
        return state
      return action.payload.data.message;
    case LOGOUT:
      return''
    default:
      return state;
  }
}


export function authReducer(state =(cookie.load('cookie_user')!==undefined), action) {
  switch (action.type) {
    //target 
    case CHECK_VALID:
      return action.payload.status === 200;
    case CHECK_SIGNUP:
      return action.payload.status === 200;
    case LOGOUT:
      return action.payload
    default:
      return (cookie.load('cookie_user')!==undefined);
  }
}
