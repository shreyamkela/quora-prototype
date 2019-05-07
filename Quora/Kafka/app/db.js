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
let uri =  "mongodb+srv://canvas_user:2407Rakhee%21@cluster0-jjkgt.mongodb.net/quoradb?poolSize=5?retryWrites=true"
mongoose.connect(uri, { useNewUrlParser: true, poolSize: 5, useCreateIndex: true });
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
  followers: [String],
  topic: { type: String },
  timestamp: { type: Date, default: Date.now },
  question: { type: String },
  author: String,
  answers: [AnswerSchema]
});

var MessageSchema = new mongoose.Schema({
  sender : String,
  senderName : String,
  receiver : String,
  receiverName : String,
  message : String, 
  time : {type :Date, default: Date.now()}, 
  isRead : Boolean
})

var ConversationSchema = new mongoose.Schema({
  person1 : String,
  person1Name : String,
  person2 : String,
  person2Name : String,
  chat : [MessageSchema]
})

var ActivitySchema = new mongoose.Schema({
  user_id:  { type: String },
  type : { type: String },
  timestamp: { type: Date, default: Date.now },
  question: { type: String },
  year: Number
})

QuestionSchema.plugin(AutoIncrement, { id: "ques_seq", inc_field: "ID" });
AnswerSchema.plugin(AutoIncrement, { id: "ans_seq", inc_field: "ID" });


var Questions = mongoose.model("Questions", QuestionSchema, "Questions");
var Profile = require("../model/profile");
var Messages = mongoose.model('Message',MessageSchema);
var Chat = mongoose.model('Chat', ConversationSchema);
var Activity = mongoose.model('Activity', ActivitySchema,'activities');

db.fetchActivity = function (msg, successCallback, failureCallback) {
  Activity.find(
    { user_id:msg.email },{'question':1, 'type':1, 'timestamp':1, 'year':1},  {sort:'-timestamp' }
  )
  .then(async docs => {
    console.log("main doc " + docs)
      let final_doc = await Promise.all(docs.map(async doc => {
        return {
          type: doc.type,
          timestamp: doc.timestamp,
          question: await fetchQuestionById(doc.question),
          year:doc.year
        }
      }))
      successCallback(final_doc);
  })
  .catch(err => {
    console.log(err);
    failureCallback(err);
  });
};


let fetchQuestionById = function (question) {
console.log("fetch question" + JSON.stringify(question))
return Questions.findOne({
    _id:  question
}, {'question':1, _id:0 }).then((docs) => {
  console.log ("func docs: " + docs)
    if (docs == null)
    {
        docs = {}
        docs.question = "a question"
    }
    return docs.question
}).catch((err) => {
    console.log(err)
    return {}
})
}


let addActivityRecord = (type, q_id, user_id) => {
  Activity.create({
    type: type,
    question: q_id,
    user_id:user_id,
    year: new Date().getFullYear()
  }).then(() =>{return})
}


// finding if a conversation exists and adding messages to it else create a new conversation

db.sendMessage = async function(values, successCallback, failureCallback){

  console.log("values: "+JSON.stringify(values));

  let senderProfile= await fetchProfileById(values.sender);
  // console.log("senderProfile: "+JSON.stringify(senderProfile));
  let receiverProfile = await fetchProfileById(values.receiver);
  // console.log("ReceiverProfile: "+JSON.stringify(receiverProfile));
  var options = {useFindAndModify:false, upsert:true};
  var senderName = senderProfile.firstname+ " "+ senderProfile.lastname;
  // console.log("senderName: "+senderName);
  var receiverName = receiverProfile.firstname + " " + receiverProfile.lastname;
  var addMessage = new Messages({"sender":values.sender,"senderName":senderName,"receiver":values.receiver,"receiverName":receiverName,"message":values.message,"isRead":false})
  // console.log("addMessage: "+JSON.stringify(addMessage));
  var conversation = {"person1":values.sender,"person1Name":senderName,"person2":values.receiver,"person2Name":receiverName,$push:{"chat":addMessage}};
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
  console.log(JSON.stringify(values))
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

//add an answer to a question------ORIGINAL-------------
// db.addAnswer = function (values, successCallback, failureCallback) {
//    console.log(values)
//     Questions.findOneAndUpdate({
//         _id:mongoose.Types.ObjectId(values.q_id)
//     }, {
//             $push: { answers: {content:values.answer,author:values.email_id,isAnonymous:values.isanonymous} } 
//         }
//     ).then(() => { 
// 	addActivityRecord('You answered',values.q_id,values.email_id)
// 	successCallback()
// 	})
//         .catch((error) => {
//             failureCallback(error)
//             return
//         })
// }

//add an answer to a question ------------ modifications for NOTIFICATIONS
//step 1: update the answer content to Question schema
// step 2: Record the activity
// step 3: count the number of answers for that question
// step 4: get the followers of the questions and update the 'actualAnswer' count for each follower of that question
db.addAnswer = function (values, successCallback, failureCallback) {
  //  console.log(values)
     Questions.findOneAndUpdate({_id:mongoose.Types.ObjectId(values.q_id)}, {$push: { answers: {content:values.answer,author:values.email_id,isAnonymous:values.isanonymous} } },
       function(error, result){
       //  console.log("Questions findOneAndUpdate================: "+JSON.stringify(result))
         if(error){
           failureCallback(error);
 
         }
         else{
           addActivityRecord('You answered',values.q_id,values.email_id)
           Questions.findOne({_id:values.q_id},function(err,size){
             if(err){
               failureCallback(err);
             }
             else {
             //  console.log("print size(result): "+JSON.stringify(size))
             let noOfAnswers = size.answers.length;
             let noOfFollowers = size.followers.length;
           //  console.log("No. of Answers: "+noOfAnswers);
           //  console.log("No. of followers: "+noOfFollowers);
             let updateProfiles = size.followers.map(follower =>{
               Profile.findOne({email:follower},function(err, update){
                   if(err){
                     console.log("error::::::::::"+err);
                     failureCallback(err);
                   }
                   else
                   {
                     //  console.log("length of questions: "+update.questionsFollowed.length);
                       var noOfQuestions = update.questionsFollowed.length;
                       for (var i=0; i < noOfQuestions; i++){
                       //  console.log("Inside for. update.questionsFollowed[i].qid:"+ mongoose.Types.ObjectId(update.questionsFollowed[i].qid)+":::");
                       //  console.log("values.q_id:"+mongoose.Types.ObjectId(values.q_id)+":::");
                         let update_qid = mongoose.Types.ObjectId(update.questionsFollowed[i].qid);
                         let values_qid = mongoose.Types.ObjectId(values.q_id);
                           if(update_qid.equals(values_qid)){
                           //  console.log("Inside if");
                           //  console.log("before:" +update.questionsFollowed[i].actualAnswers);
                             update.questionsFollowed[i].actualAnswers = noOfAnswers;
                           //  console.log("after1:" +update.questionsFollowed[i].actualAnswers);
                             update.save();
                           //  console.log("after2:" +update.questionsFollowed[i].actualAnswers);
                           }
                       }
                       successCallback();
                   }
   
                 })
             })
           }
         })
           
         }
       }
     )
 }
 

//update  an answer
db.updateAnswer = function (values, successCallback, failureCallback) {
  console.log(values)
  Questions.findOneAndUpdate(
    {
      "answers._id": mongoose.Types.ObjectId(values.a_id)
    },
    {
      $set: { "answers.$.content": values.answer ,"answers.$.isAnonymous":values.isanonymous}
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
		answers: {
        $elemMatch:
        {
          "_id": mongoose.Types.ObjectId(values.a_id),
          "votes.user": { $ne: values.email_id }
        }
	 }
    },
    {
      $push: { "answers.$.votes": { user: values.email_id, flag: values.flag } }
    }
  )
    .then((docs) => {
      console.log(docs)
      Questions.findOneAndUpdate(
        {
          /*"answers._id": mongoose.Types.ObjectId(values.a_id),
          "answers.votes.user": values.email_id*/
          answers: {
            $elemMatch:
            {
              "_id": mongoose.Types.ObjectId(values.a_id),
              "votes.user": values.email_id
            }
          }

        },
        {
          $set: { "answers.$[outer].votes.$[inner].flag": values.flag }
        },
        {
          "arrayFilters": [
            { "outer._id": mongoose.Types.ObjectId(values.a_id)},
            { "inner.user": values.email_id }
          ]
        }
      )
        .then((docs) => {
          console.log(docs)
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

//get retrieve all the answers of a user
db.getAnswersByUserId= function (email_id, successCallback, failureCallback) {
  Questions.find({
    "answers.author": email_id
  },'answers.$ _id question timestamp author')
    .then(async docs => {
      console.log(docs)
        let final_doc = await Promise.all(docs.map(async doc => {
          return {
            ques_id: doc._id,
            question: doc.question,
            posted_on: doc.timestamp,
            profile: await fetchProfileById(doc.author),
            answers: await Promise.all(
              doc.answers.map(async ans => {
                console.log(ans);
                ans = ans.toJSON();
                ans.profile = await fetchProfileById(ans.author);
                return await ans;
              })
            )
          }
        }))
        successCallback(final_doc);
    })
    .catch(err => {
      console.log(err);
      failureCallback(err);
    });
};


// ---------------NEWWWWWW-------------------
db.getNotifications = function(email, successCallback, failureCallback) {
  Profile.findOne({email:email})
  .then(async result => {
    resultNotification = [];
    console.log(JSON.stringify(result));
    let final_doc = await Promise.all(result.questionsFollowed.map(async qf =>{
      console.log("qf :"+JSON.stringify(qf));
      return{
        qu : await Questions.findOne({_id:mongoose.Types.ObjectId(qf.qid)})
            .then( async ques =>{
            console.log("ques: "+JSON.stringify(ques.question));
            noOfNotifications = qf.actualAnswers - qf.initialAnswers;
            if(noOfNotifications > 0){
            console.log("noOfNotifications: "+noOfNotifications)
            resultNotification.push({qid:qf.qid,question:ques.question,notifications:noOfNotifications});
            console.log("resultNotification: "+JSON.stringify(resultNotification))
            return await resultNotification;
            }
            
            })
            .catch(err => {
              console.log("some error: "+err);
            })
      }
      }))
    console.log("resultNotification: "+JSON.stringify(resultNotification))
    successCallback(resultNotification)

  })
  .catch(err => 
    {
      failureCallback(err);
      return;
    })
}

//-----------NEEWWWWWWWWW-------------
db.updateNotifications = function(values, successCallBack, failureCallback){
  Profile.findOne({email:values.email},{questionsFollowed:{$elemMatch:{qid:values.qid}}})
  .then(result => {
    console.log("qid: "+JSON.stringify(result.questionsFollowed[0]));
    result.questionsFollowed[0].initialAnswers = result.questionsFollowed[0].initialAnswers + values.notifications;
    result.save();
    console.log("result updated::::: "+JSON.stringify(result));
    successCallBack();
  })
  .catch(err => {
    console.log(err);
    failureCallback(err);
    }
  );
}


//bookmark an answer
db.bookmark = function (values, successCallback, failureCallback) {
  console.log(values)
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
            docs.photo = "https://firebasestorage.googleapis.com/v0/b/quora-c0359.appspot.com/o/images%2Fdefault_profile.png?alt=media&token=5f27f99d-60ec-48f5-86f9-3dda0931b27c"
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

db.getAnswersByQuestionId = function (q_id, successCallback, failureCallback) {
  try {
    Questions.findOne({
      _id: mongoose.Types.ObjectId(q_id)
    })
      .then(async doc => {
        if (doc !== null) {
          let final_doc = await {
            ques_id: doc._id,
            question: doc.question,
            posted_on: doc.timestamp,
            author:doc.author,
            profile: await fetchProfileById(doc.author),
            answers: await Promise.all(
              doc.answers.map(async ans => {
                console.log(ans);
                ans = ans.toJSON();
                ans.profile = await fetchProfileById(ans.author);
                ans.comments= await Promise.all(
                  ans.comments.map(async c => {
                    c.profile = await fetchProfileById(c.author);
                    return await c;
                  }))
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
  } catch (err) {
    failureCallback(err);
  }
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
        },
        question: 1,
        author:1
      }
    }
  ])
    .then(async docs => {
      let final_doc = await Promise.all(docs.map(async doc => {
        return {
          ques_id: doc._id,
          question: doc.question,
          posted_on: doc.timestamp,
          profile: await fetchProfileById(doc.author),
          answers: await Promise.all(
            doc.answers.map(async ans => {
              console.log(ans);
              //ans = ans.toJSON();
              ans.profile = await fetchProfileById(ans.author);
              return await ans;
            })
          )
        }
      }))
      successCallback(final_doc);
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
        },
        question:1
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
      answers = []
      docs.map(d => {
        d.answers.map(a => {
          answers.push({
            content: a.content,
            upvotes: countvotes(a),
            ques_id: d._id,
            question:d.question
          });
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
        },
        question:1
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
            ques_id: d._id,
            question:d.question
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

        addActivityRecord('You asked',questionInfo._id,questionInfo.email_id)

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

                console.log("CHECK THIS");
                console.log(doc);
                console.log("CHECK THIS");

                let final_doc = await {
                    ques_id: doc._id,
                    // question: doc.question,
                    profile: await fetchProfileById(""),
                    question: await Promise.all(
                        doc.question.map(async ans => {
                            console.log(ans);
                            console.log("############");
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

db.deleteUser = function (user, successCallback, failureCallback) {
  let sql = "DELETE FROM Users where Email = " + mysql.escape(user.email_id);
  con.query(sql, function (err, result) {
    
      if (err) {
         failureCallback(err)
      }
      console.log('Deleted Row(s):', result.affectedRows, " ", result.changedRows);
      if (result.affectedRows === 0) {
        console.log("row not deleted")
          failureCallback("User not found in db.js")
      }
      if (result.affectedRows > 0) {
        console.log("row successfully deleted")
        successCallback(result[0])
    }
  })
}

module.exports = db;
