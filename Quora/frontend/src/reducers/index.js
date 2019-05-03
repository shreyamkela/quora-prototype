import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { loginReducer, signupReducer, authReducer } from "./reducer_login"
import { updateProfileReducer } from "./reducer_updateProfile"
import { profileReducer } from "./reducer_profile"
import { fetchAnswersReducer, displayAddAnswerFormReducer, fetchTopDownAnswersReducer, fetchTopUpAnswersReducer } from "./reducer_answers";

const rootReducer = combineReducers({
  login_msg: loginReducer,
  signup_msg: signupReducer,
  authFlag:authReducer,
  updprofile: updateProfileReducer,
  profile: profileReducer,
  ques_answers: fetchAnswersReducer,
  displayAddAnswer: displayAddAnswerFormReducer,
  topUpAnswers:fetchTopUpAnswersReducer,
  topDownAnswers:fetchTopDownAnswersReducer,
  form: formReducer
});

export default rootReducer;
