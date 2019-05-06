import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { loginReducer, signupReducer, authReducer } from "./reducer_login"
import { updateProfileReducer } from "./reducer_updateProfile"
import { profileReducer } from "./reducer_profile"
import { fetchAnswersReducer, displayAddAnswerFormReducer, fetchTopDownAnswersReducer, fetchTopUpAnswersReducer, fetchUserAnswersReducer, fetchBookmarksReducer,fetchUserQuestionsReducer } from "./reducer_answers";
import { fetchActivityReducer } from "./reducer_userActivity"

const rootReducer = combineReducers({
  login_msg: loginReducer,
  signup_msg: signupReducer,
  authFlag:authReducer,
  updprofile: updateProfileReducer,
  profile: profileReducer,
  ques_answers: fetchAnswersReducer,
  displayAddAnswer: displayAddAnswerFormReducer,
  topUpAnswers:fetchTopUpAnswersReducer,
  topDownAnswers: fetchTopDownAnswersReducer,
  userAnswers: fetchUserAnswersReducer,
   fetchQuestions: fetchUserQuestionsReducer,
  bookmarked_answers:fetchBookmarksReducer,
  userActivities: fetchActivityReducer,
  form: formReducer
});

export default rootReducer;
