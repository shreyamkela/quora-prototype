var connection = require('./kafka/Connection')
//topics files
var Login = require('./services/login.js');
var Signup = require('./services/signup.js');

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
//first argument is topic name
//second argument is a function that will handle this topic request
