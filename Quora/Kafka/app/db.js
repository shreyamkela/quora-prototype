//Get Mongo Client from mongodb library
var crypt = require('./crypt');
var db = {};
let mysql = require('mysql')
let con = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'Quora_Db',
    multipleStatements:true
})
const mongoose = require('mongoose');
//"mongodb://localhost:27017/CanvasApp"
let uri = "mongodb+srv://canvas_user:canvas@canvas-upy4d.mongodb.net/CanvasApp?retryWrites=true"
mongoose.connect("mongodb://localhost:27017/QuoraApp", { useNewUrlParser: true ,poolSize:5});
let con1 = mongoose.connection
con1.on('error', console.error.bind(console, 'connection error:'));
con1.once('open', function() {
  console.log("Connected")
});

var AutoIncrement = require('mongoose-sequence')(mongoose);

var CommentSchema = new mongoose.Schema({
    comment: String,
    author: String,
    postedon: { type : Date, default: Date.now }
    
})

var VoteSchema = new mongoose.Schema({
    user: String,
    timestamp: { type: Date, default: Date.now },
    flag:Number //0 for upvote 1 for downvote
})


var AnswerSchema = new mongoose.Schema({
    answered_on:{ type : Date, default: Date.now },
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
    topic: {type: String},
    timestamp: { type: Date, default: Date.now },
    // author: {User},
    answers: [AnswerSchema]
})

QuestionSchema.plugin(AutoIncrement, { id: 'ques_seq', inc_field: 'ID' })
AnswerSchema.plugin(AutoIncrement, { id: 'ans_seq', inc_field: 'ID' })

var Questions = mongoose.model('Questions', QuestionSchema, 'Questions');

// Creating a new User and creating profile for the user
db.createUser = function (user, successCallback, failureCallback) {
    var passwordHash;
    console.log(user)
    crypt.createHash(user.password, function (res) {
        passwordHash = res;
        let sql = "INSERT INTO Users (Email, Password) VALUES ( " + mysql.escape(user.email_id) + " , " + mysql.escape(passwordHash) + " ); "
        con.query(sql, function (err, result) {
            if (err) {
                failureCallback(err)
            }
            else {
                successCallback()
            }
        })
    }, function (err) {
        console.log(err)
        failureCallback(err)
    });
}


db.findUser = function (user, successCallback, failureCallback) {
    let sql = "Select * from Users where Email = " + mysql.escape(user.email_id);
    con.query(sql, function (err, result) {
        if (err) {
           failureCallback(err)
        }
        if (result[0] === undefined) {
            failureCallback("User not found")
        }
        else {
           successCallback(result[0])   
        }
    })
}

//add an answer to a question
db.addAnswer = function (values, successCallback, failureCallback) {
    Questions.findOneAndUpdate({
        ID: Number(values.q_id)
    }, {
            $push: { answers: {content:values.answer} } 
        }
    ).then(() => { successCallback() })
        .catch((error) => {
            failureCallback(error)
            return
        })
}

//upvote or downvote an answer
db.vote = function (values, successCallback, failureCallback) {
    Questions.findOneAndUpdate({
        "answers._id": mongoose.Types.ObjectId(values.a_id),
        "answers.votes.user": {$ne: values.email_id }
    }, {
            $push: { "answers.$.votes": {user:values.email_id,flag:values.flag} } 
        }
    ).then(() => {
        Questions.findOneAndUpdate({
            "answers._id": mongoose.Types.ObjectId(values.a_id),
            "answers.votes.user": values.email_id 
        }, {
                $set: { "answers.$.votes.$[].flag": values.flag } 
            }
        ).then(() => { successCallback() })
            .catch((error) => {
                failureCallback(error)
                return
        })
    })
        .catch((error) => {
            failureCallback(error)
            return
    })
    
        
}


//comment on an answer
db.comment = function (values, successCallback, failureCallback) {
    Questions.findOneAndUpdate({
        "answers._id": mongoose.Types.ObjectId(values.a_id)
    }, {
            $push: { "answers.$.comments": {author:values.email_id,comment:values.comment} } 
        }
    ).then(() => { successCallback() })
        .catch((error) => {
            failureCallback(error)
            return
        })
}

//comment on an answer
db.bookmark = function (values, successCallback, failureCallback) {
    Questions.findOneAndUpdate({
        "answers._id": mongoose.Types.ObjectId(values.a_id)
    }, {
            $push: { "answers.$.bookmarks": values.email_id } 
        }
    ).then(() => { successCallback() })
        .catch((error) => {
            failureCallback(error)
            return
        })
}

db.getAnswersByQuestionId = function (q_id, successCallback, failureCallback) {
    Questions.find({
        ID:Number(q_id)
    }).then(async (docs)=>{
       successCallback(docs) 
    }).catch((err)=>{failureCallback(err)})
}

db.getBookmarks = function (email_id, successCallback, failureCallback) {
    Questions.find({
        "answers.bookmarks.":email_id
    },'answers').then(async (docs)=>{
       successCallback(docs) 
    }).catch((err)=>{failureCallback(err)})
}

module.exports = db;