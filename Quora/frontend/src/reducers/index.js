import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { loginReducer, signupReducer, authReducer } from "./reducer_login"

const rootReducer = combineReducers({
  login_msg: loginReducer,
  signup_msg: signupReducer,
  authFlag:authReducer,
  form: formReducer
});

export default rootReducer;
