// Mongoose Setup - MongoDB - ORM
const mongoose = require("mongoose");
var db = {};
//mongoose.Promise = global.Promise;
let uri = "mongodb+srv://canvas_user:2407Rakhee%21@cluster0-jjkgt.mongodb.net/quoradb?poolSize=5?retryWrites=true";
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
  //questionsFollowed: Array,   ---CHANGED BELOW
  questionsFollowed: [{qid : mongoose.Schema.Types.ObjectId, actualAnswers: Number, initialAnswers: Number}],
  questionAdded: Array
});

var ActivitySchema = new mongoose.Schema({
  user_id:  { type: String },
  type : { type: String },
  timestamp: { type: Date, default: Date.now },
  question: { type: String },
  year: Number
})

var Activity = mongoose.model('Activity', ActivitySchema,'activities');



var QuestionSchema = new mongoose.Schema({
  ID: { type: Number, unique: true },
  topics: [String],
  timestamp: { type: Date, default: Date.now() },
  question: String,
  author: String,
  answers: Array,
  followers: Array
});
QuestionSchema.plugin(AutoIncrement, { id: "ques_seq", inc_field: "ID" });
var Questions = mongoose.model("Questions", QuestionSchema, "Questions");

let fetchProfileById = function (email_id) {


    return profile.findOne({
        email: email_id
    }, 'firstname lastname credentials photo').then((docs) => {
        if (docs == null)
        {
            docs = {}
            docs.firstname = "Quora"
            docs.lastname = "User"
            docs.credentials = ""
            docs.photo = "http://localhost:3001/profile_uploads/default_profile.png"
            docs.deactivated = true
        }
        else {
            docs = docs.toJSON()
            docs.deactivated = false
        }
        return docs
    }).catch((err) => {
        console.log(err)
        return {}
    })
}


getQuestionByEmail = function (email_id, successCallback, failureCallback) {

    Questions.find({
        author: email_id
    })
        .then(async questionByMeArr => {
            let final_doc = await Promise.all(questionByMeArr.map(async doc => {

                return {
                    question: doc.question,
                    _id: doc._id,
                    profile: await fetchProfileById(doc.author),
                    answers: await Promise.all(
                        doc.answers.map(async ans => {
                            // console.log(ans);
                            // ans = ans.toJSON();
                            ans.profile = await fetchProfileById(ans.author);
                            return await ans;
                        })
                    )
                }
            }));

            successCallback(final_doc);
        })
        .catch(err => {
            console.log(err);
            failureCallback(err);
        });
};


module.exports = {
  topics,
  Questions,
    getQuestionByEmail,
  profile,
  Activity
};
