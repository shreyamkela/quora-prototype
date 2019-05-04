var connection = require('./kafka/Connection')
//topics files
var Login = require('./services/login.js');
var Signup = require('./services/signup.js');
var Profile = require('./services/profile.js');
var UpdateProfile = require('./services/update_profile.js');
var ProfilePic = require('./services/profilepic.js');
var Question = require('./services/question');
var Answers = require('./services/fetchAnswers')
var addAnswer = require('./services/addAnswer')
var fetchQuestions = require('./services/fetchQuestions')
var fetchUserAnswers = require('./services/fetchUserAnswers')
var Comment = require('./services/comment')

function handleTopicRequest(topic_name,fname){
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function (err, res) {
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data: res,
                        err:err
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function (err, data) {
                if (err)
                    {console.log(err)}
                console.log(data);
            });
            return;
        });
        
    });
    consumer.on("error", function (error) {
        console.log(error)
    })
}
// Add your TOPICs here
handleTopicRequest("user_login", Login)
handleTopicRequest("user_signup", Signup)
handleTopicRequest("profile", Profile)
handleTopicRequest("update_profile", UpdateProfile)
handleTopicRequest("profilepic", ProfilePic)
handleTopicRequest("add_question", Question)
handleTopicRequest("fetch_answers", Answers)
handleTopicRequest("add_answer", addAnswer)
handleTopicRequest("fetch_questions", fetchQuestions)
handleTopicRequest("user_answers", fetchUserAnswers)
handleTopicRequest("answer_comment", Comment)
//first argument is topic name
//second argument is a function that will handle this topic request
