//import the require dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
app.set("view engine", "ejs");
//const fileUpload = require('express-fileupload');

var Login = require("./routes/Login");
var Signup = require("./routes/Signup");
var Answer = require("./routes/Answer");
var updateAnswer = require("./routes/updateAnswer");
var Bookmark = require("./routes/Bookmark");
var Vote = require("./routes/Vote");
var Follow = require("./routes/Follow");
var Unfollow = require("./routes/Unfollow");
var TopUpAnswers = require("./routes/TopUpAnswers");
var TopDownAnswers = require("./routes/TopDownAnswers");
var UserAnswers = require('./routes/UserAnswers');
var Comment = require('./routes/Comment');
var Profile = require("./routes/Profile");
var Question = require("./routes/Question");
var SearchQuestions = require("./routes/SearchQuestions");
var SearchTopics = require("./routes/SearchTopics");
var SearchPeople = require("./routes/SearchPeople");
var TopicsFollowed = require("./routes/TopicsFollowed");
var TopicsUnfollowed = require("./routes/TopicsUnfollowed")
var FetchAllTopics = require("./routes/FetchAllTopics")
var Messages = require('./routes/Messages');
var FetchQuestions = require('./routes/FetchQuestion');
var QuestionsInTopic = require('./routes/QuestionsInTopic');
var QuestionFollowed = require('./routes/QuestionFollowed');
var QuestionUnfollowed = require('./routes/QuestionUnfollowed');
var FetchFollowers = require('./routes/FetchFollowers');
var FetchFollowing = require('./routes/FetchFollowing');
var Activity = require('./routes/Activity');
var FetchViews = require('./routes/FetchViews');
var Notifications = require('./routes/Notifications');

var passport = require("passport");
// Set up middleware
var requireAuth = passport.authenticate("jwt", { session: false });
app.use(passport.initialize());

//use to upload files
//app.use(fileUpload())
//cookie parser
app.use(cookieParser());
//static directory
app.use(express.static("public"));

//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//use express session to maintain session data
app.use(
  session({
    secret: "canvas-secret",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
  })
);

app.use(bodyParser.json({ limit: "10mb", extended: true }));

//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});
app.use("/profile_uploads", express.static("profile_uploads"));

//define routes
app.use("/login", Login);
app.use("/signup", Signup);
app.use("/answer", Answer);
app.use("/bookmark", Bookmark);
app.use("/vote", Vote);
app.use("/follow", Follow);
app.use("/unfollow", Unfollow);
app.use("/profile", Profile);
app.use("/updateanswer", updateAnswer);
app.use("/topupanswers", TopUpAnswers);
app.use("/topdownanswers", TopDownAnswers);
app.use("/questions", Question);
app.use("/searchQuestions", SearchQuestions);
app.use("/searchTopics", SearchTopics);
app.use("/searchPeople", SearchPeople);
app.use("/topicsFollowed", TopicsFollowed);
app.use("/topicsUnfollowed", TopicsUnfollowed);
app.use("/questionsFollowed", QuestionFollowed);
app.use("/questionUnfollowed", QuestionUnfollowed);
app.use("/fetchAllTopics", FetchAllTopics);
app.use('/message', Messages);
app.use('/fetchQuestions', FetchQuestions);
app.use('/useranswers', UserAnswers);
app.use('/comment', Comment);
app.use('/questionsInTopic', QuestionsInTopic);
app.use('/fetchfollowers', FetchFollowers);
app.use('/fetchfollowing', FetchFollowing);
app.use('/activity', Activity);
app.use('/fetchviews', FetchViews);
app.use('/notifications',Notifications);

module.exports = app;
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
