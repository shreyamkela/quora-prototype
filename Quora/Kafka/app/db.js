//Get Mongo Client from mongodb library
var crypt = require("./crypt");
var db = {};
let mysql = require("mysql");
let profileSchema = require("../model/profile");
let con = mysql.createPool({
  host: "cmpe273-quora-group3.cjw2lhsmorrx.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "ErFgksugsMV0fj0OQjKx",
  database: "Quora_Db",
  multipleStatements: true
});
const mongoose = require("mongoose");
//"mongodb://localhost:27017/CanvasApp"
let uri =  "mongodb+srv://canvas_user:2407Rakhee%21@cluster0-jjkgt.mongodb.net/quoradb?poolSize=10?retryWrites=true"
mongoose.connect(uri, { useNewUrlParser: true, poolSize: 5 });
let con1 = mongoose.connection;
con1.on("error", console.error.bind(console, "connection error:"));
con1.once("open", function() {
  console.log("Connected");
});
var AutoIncrement = require("mongoose-sequence")(mongoose);

var CommentSchema = new mongoose.Schema({
  comment: String,
  author: String,
  postedon: { type: Date, default: Date.now }
});

var VoteSchema = new mongoose.Schema({
  user: String,
  timestamp: { type: Date, default: Date.now },
  flag: Number //0 for upvote 1 for downvote
});

var AnswerSchema = new mongoose.Schema({
  answered_on: { type: Date, default: Date.now },
  content: String,
  author: String,
  isAnonymous: Number,
  votes: [VoteSchema],
  comments: [CommentSchema],
  bookmarks: [String]
});

var QuestionSchema = new mongoose.Schema({
  ID: { type: Number, unique: true },
  // followers: [UserSchema],
  topic: { type: String },
  timestamp: { type: Date, default: Date.now },
  question: { type: String },
  author: String,
  answers: [AnswerSchema]
});

var MessageSchema = new mongoose.Schema({
    sender : String,
    receiver : String,
    message : String, 
    time : {type :Date, default: Date.now()}, 
    isRead : Boolean
})

var ConversationSchema = new mongoose.Schema({
    person1 : String,
    person2 : String,
    chat : [MessageSchema]
})

QuestionSchema.plugin(AutoIncrement, { id: "ques_seq", inc_field: "ID" });
AnswerSchema.plugin(AutoIncrement, { id: "ans_seq", inc_field: "ID" });


var Questions = mongoose.model("Questions", QuestionSchema, "Questions");
var Profile = require("../model/profile");
var Messages = mongoose.model('Message',MessageSchema);
var Chat = mongoose.model('Chat', ConversationSchema);

// finding if a conversation exists and adding messages to it else create a new conversation

db.sendMessage = function(values, successCallback, failureCallback){

    console.log("values: "+JSON.stringify(values));
    var options = {useFindAndModify:false, upsert:true};
    var addMessage = new Messages({"sender":values.sender,"receiver":values.receiver,"message":values.message,"isRead":false})
    console.log("addMessage: "+JSON.stringify(addMessage));
    var conversation = {"person1":values.sender,"person2":values.receiver,$push:{"chat":addMessage}};
    console.log("conversation: "+JSON.stringify(conversation));
    Chat.findOneAndUpdate({$or:[{$and:[{person1:values.sender},{person2:values.receiver}]},{$and:[{person1:values.receiver},{person2:values.sender}]}]},conversation, options)
       
    .then(() => {successCallback()})
        .catch((error) => {
            failureCallback(error)
            return
        })
}

// show message box
db.showMessages = function(email_id, successCallback, failureCallback){
    Chat.find({$or:[{person1:email_id},{person2:email_id}]},{_id:0})
        .then((result) => {
            console.log("Result message get: "+JSON.stringify(result));
            successCallback(result)
        })
        .catch((error) => {
            failureCallback(error);
        })
        
}

// Creating a new User and creating profile for the user
db.createUser = function(user, successCallback, failureCallback) {
  var passwordHash;
  console.log(user);
  crypt.createHash(
    user.password,
    function(res) {
      passwordHash = res;
      let sql = "INSERT INTO Users (Email, Password) VALUES ( " + mysql.escape(user.email_id) + " , " + mysql.escape(passwordHash) + " ); ";
      con.query(sql, function(err, result) {
        if (err) {
          failureCallback(err);
        } else {
          successCallback();
        }
      });
    },
    function(err) {
      console.log(err);
      failureCallback(err);
    }
  );
};

db.findUser = function(user, successCallback, failureCallback) {
  let sql = "Select * from Users where Email = " + mysql.escape(user.email_id);
  con.query(sql, function(err, result) {
    if (err) {
      failureCallback(err);
    }
    if (result[0] === undefined) {
      failureCallback("User not found");
    } else {
      successCallback(result[0]);
    }
  });
};

//add new follower user (my_email) to target user (target_email)
//to be clear: (my_email is gonna follow target_email)
//2 step update
//Step1: Add my_email to followers array of target_email
//Step2: Add target_email to following array of my_email
db.addFollower = function(values, successCallback, failureCallback) {
  //step1:
  Profile.findOneAndUpdate(
    {
      email: values.target_email
    },
    {
      $push: { followers: values.my_email }
    }
  )
    .then(() => {
      //step2:
      Profile.findOneAndUpdate(
        {
          email: values.my_email
        },
        {
          $push: { following: values.target_email }
        }
      )
        .then(() => {
          successCallback();
        })
        .catch(error => {
          failureCallback(error);
          return;
        });
    })
    .catch(error => {
      failureCallback(error);
      return;
    });
};

//add an answer to a question
db.addAnswer = function (values, successCallback, failureCallback) {
   console.log(values)
    Questions.findOneAndUpdate({
        _id:mongoose.Types.ObjectId(values.q_id)
    }, {
            $push: { answers: {content:values.answer,author:values.email_id,isAnonymous:values.isanonymous} } 
        }
    ).then(() => { successCallback() })
        .catch((error) => {
            failureCallback(error)
            return
        })
}

//update  an answer
db.updateAnswer = function(values, successCallback, failureCallback) {
  Questions.findOneAndUpdate(
    {
      "answers._id": mongoose.Types.ObjectId(values.a_id)
    },
    {
      $set: { "answers.$.content": values.answer }
    }
  )
    .then(() => {
      successCallback();
    })
    .catch(error => {
      failureCallback(error);
      return;
    });
};

//upvote or downvote an answer
db.vote = function(values, successCallback, failureCallback) {
  Questions.findOneAndUpdate(
    {
      "answers._id": mongoose.Types.ObjectId(values.a_id),
      "answers.$.votes.user": { $ne: values.email_id }
    },
    {
      $push: { "answers.$.votes": { user: values.email_id, flag: values.flag } }
    }
  )
    .then(() => {
      Questions.findOneAndUpdate(
        {
          "answers._id": mongoose.Types.ObjectId(values.a_id),
          "answers.votes.user": values.email_id
        },
        {
          $set: { "answers.$.votes.$$.flag": values.flag }
        }
      )
        .then(() => {
          successCallback();
        })
        .catch(error => {
          failureCallback(error);
          return;
        });
    })
    .catch(error => {
      failureCallback(error);
      return;
    });
};

//comment on an answer
db.comment = function(values, successCallback, failureCallback) {
  Questions.findOneAndUpdate(
    {
      "answers._id": mongoose.Types.ObjectId(values.a_id)
    },
    {
      $push: { "answers.$.comments": { author: values.email_id, comment: values.comment } }
    }
  )
    .then(() => {
      successCallback();
    })
    .catch(error => {
      failureCallback(error);
      return;
    });
};

//bookmark an answer
db.bookmark = function(values, successCallback, failureCallback) {
  Questions.findOneAndUpdate(
    {
      "answers._id": mongoose.Types.ObjectId(values.a_id)
    },
    {
      $push: { "answers.$.bookmarks": values.email_id }
    }
  )
    .then(() => {
      successCallback();
    })
    .catch(error => {
      failureCallback(error);
      return;
    });
};

let fetchProfileById = function (email_id) {
    console.log(email_id)
    return Profile.findOne({
        email: email_id
    }, 'firstname lastname credentials photo').then((docs) => {
        if (docs == null)
        {
            docs = {}
            docs.firstname = "Quora"
            docs.lastname = "User"
            docs.credentials = ""
            docs.photo = "http://localhost:3001/profile_uploads/default_profile.png"
        }
        return docs
    }).catch((err) => {
        console.log(err)
        return {}
    })
}

db.getAnswersByQuestionId = function (q_id, successCallback, failureCallback) {
  console.log(q_id)
  Questions.findOne({
    _id: mongoose.Types.ObjectId(q_id)
  })
    .then(async doc => {
      if (doc !== null) {
        let final_doc = await {
          ques_id: doc._id,
          question: doc.question,
          posted_on: doc.timestamp,
          profile: await fetchProfileById(""),
          answers: await Promise.all(
            doc.answers.map(async ans => {
              console.log(ans);
              ans = ans.toJSON();
              ans.profile = await fetchProfileById(ans.author);
              return await ans;
            })
          )
        };
        successCallback(final_doc);
      }
      else successCallback(doc)
    })
    .catch(err => {
      console.log(err);
      failureCallback(err);
    });
};

/*
db.getBookmarks = function (email_id, successCallback, failureCallback) {
    Questions.find({
        "answers.bookmarks.":email_id
    },'answers').then(async (docs)=>{
       successCallback(docs) 
    }).catch((err)=>{failureCallback(err)})
}*/
db.getBookmarks = function(email_id, successCallback, failureCallback) {
  Questions.aggregate([
    { $match: { "answers.bookmarks.": email_id } },
    {
      $project: {
        answers: {
          $filter: {
            input: "$answers",
            as: "answer",
            cond: {
              $in: [email_id, "$$answer.bookmarks"]
            }
          }
        }
      }
    }
  ])
    .then(async docs => {
      console.log(docs);
      successCallback(docs);
    })
    .catch(err => {
      console.log(err);
      failureCallback(err);
    });
};

db.getTopAnswers = function(email_id, successCallback, failureCallback) {
  /*Questions.find({
      "answers.author": email_id
  },'answers.$')*/
  Questions.aggregate([
    { $match: { "answers.author": email_id } },
    {
      $project: {
        answers: {
          $filter: {
            input: "$answers",
            as: "answer",
            cond: {
              $eq: ["$$answer.author", email_id]
            }
          }
        }
      }
    }
  ])
    .then(async docs => {
      console.log(docs);
      console.log(email_id);
      countvotes = a => {
        console.log(a);
        if (a.votes !== undefined) return a.votes.filter(v => v.flag === 1).length;
        else return 0;
      };
      answers = docs.map(d => {
        return d.answers.map(a => {
          return {
            content: a.content,
            upvotes: countvotes(a),
            ques_id: d._id
          };
        });
      });
      console.log(answers);
      new_docs = answers.sort(function(a, b) {
        return b.upvotes - a.upvotes;
      });
      successCallback(new_docs.slice(0, 10));
    })
    .catch(err => {
      console.log(err);
      failureCallback(err);
    });
};

db.getTopDownAnswers = function(email_id, successCallback, failureCallback) {
  Questions.aggregate([
    { $match: { "answers.author": email_id } },
    {
      $project: {
        answers: {
          $filter: {
            input: "$answers",
            as: "answer",
            cond: {
              $eq: ["$$answer.author", email_id]
            }
          }
        }
      }
    }
  ])
    .then(docs => {
      console.log(docs);
      console.log(email_id);
      countvotes = a => {
        console.log(a);
        if (a.votes !== undefined) return a.votes.filter(v => v.flag === 0).length;
        else return 0;
      };
      answers = [];
      docs.map(d => {
        d.answers.map(a => {
          answers.push({
            content: a.content,
            downvotes: countvotes(a),
            ques_id: d._id
          });
        });
      });
      new_docs = answers.sort(function(a, b) {
        return b.downvotes - a.downvotes;
      });
      console.log(new_docs);
      successCallback(new_docs.slice(0, 5));
    })
    .catch(err => {
      console.log(err);
      failureCallback(err);
    });
};

// db.addQuestion = function (questionInfo,  successCallback, failureCallback ) {
//     let questions = new Questions(questionInfo);
//     let result = {};
//
//     questions.save()
//         .then(() => {successCallback})
//         .catch((error) => {
//             failureCallback(error)
//             return
//         })
// }

db.addQuestion = function(questionInfo, successCallback, failureCallback) {
  let questions = new Questions(questionInfo);
  let result = {};

  questions.save().then(
    questions => {
      // questions posted successfully.
      console.log("Saved questions details: ", questions._id);
      result.code = 200;
      callback(null, result);
    },
    err => {
      if (err) {
        console.log(err);
      }
      result.code = 500;
      callback(null, result);
    }
  );
};


db.getQuestionByEmail = function (email_id, successCallback, failureCallback) {
    console.log(email_id)
    Questions.findOne({
        _id: mongoose.Types.ObjectId(email_id)
    })
        .then(async doc => {
            if (doc !== null) {
                let final_doc = await {
                    ques_id: doc._id,
                    // question: doc.question,
                    profile: await fetchProfileById(""),
                    question: await Promise.all(
                        doc.question.map(async ans => {
                            console.log(ans);
                            ans = ans.toJSON();
                            ans.profile = await fetchProfileById(ans.author);
                            return await ans;
                        })
                    )
                };
                successCallback(final_doc);
            }
            else successCallback(doc)
        })
        .catch(err => {
            console.log(err);
            failureCallback(err);
        });
};

module.exports = db;
