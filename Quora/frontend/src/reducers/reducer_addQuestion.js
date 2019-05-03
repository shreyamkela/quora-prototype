import { ADD_QUESTIONS} from "../actions";
import cookie from 'react-cookies';


//Reducer listening to different action types
//initial state is {}
export function updateProfileReducer(state =(cookie.load('cookie_user')!==undefined), action) {
    switch (action.type) {
        //target

        case ADD_QUESTIONS:
            console.log("add questions " + action.payload)
            return  {
                status: action.payload
            }

        default:
            return state;
    }
}

