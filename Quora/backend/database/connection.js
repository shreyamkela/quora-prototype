// Mongoose Setup - MongoDB - ORM
const mongoose = require("mongoose");

//mongoose.Promise = global.Promise;
let uri = "mongodb+srv://canvas_user:2407Rakhee%21@cluster0-jjkgt.mongodb.net/quoradb?poolSize=10?retryWrites=true";
mongoose.Promise = global.Promise;
mongoose.connect(uri, { useNewUrlParser: true, poolSize: 5, useCreateIndex: true });
// NOTE - useCreateIndex is important otherwise it causes this error - https://www.opentechguides.com/askotg/question/16/mongodb-create-unique-index-e11000-duplicate-key-error-collection-dup-keynull
let con1 = mongoose.connection;
con1.on("error", console.error.bind(console, "Connection error in mongoose (backend folder): "));
con1.once("open", function () {
  console.log("Connected to mongoose - From backend folder");
});
var AutoIncrement = require("mongoose-sequence")(mongoose);

// NOTE - Have to keep all model schema declarations in the file where the above mongo/mongoose connections have been made,
// so that the connection is available to the below schema. If schema is kept in a different file then we have to export the connection configuration from here
// Topics Model
var topics = mongoose.model("topics", {
  title: String,
  questionIds: Array,
  followers: Array
});

var profile = mongoose.model("profile", {
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  email: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zipcode: {
    type: String
  },
  education: {
    type: String
  },
  career: {
    type: String
  },
  aboutme: {
    type: String
  },
  credentials: {
    type: String
  },
  photo: {
    type: String
  },
  followers: [String],
  following: [String],
  topicsFollowed: Array,
  questionsFollowed: Array
});


var QuestionSchema = new mongoose.Schema({
  ID: { type: Number, unique: true },
  topics: [String],
  timestamp: { type: Date, default: Date.now() },
  question: { type: String },
  author: String,
  answers: [String],
  followers: [String]
});
QuestionSchema.plugin(AutoIncrement, { id: "ques_seq", inc_field: "ID" });
var Questions = mongoose.model("Questions", QuestionSchema, "Questions");


module.exports = {
  topics,
  Questions,
  profile
};
