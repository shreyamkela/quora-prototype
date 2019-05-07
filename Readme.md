Instructions to run the project:  

Terminal 1:  
cd frontend  
npm install  
npm start  

Terminal 2:  
cd backend  
npm install  
node index.js  

Terminal 3:  
cd Kafka    
npm install  
npm start  


Create database Quora_Db;

create table Users(Email varchar(100),Password varchar(100), Primary Key(Email));

create the below topics in Kafka:

```
__consumer_offsets
activity
add_answer
add_question
answer_comment
bookmark_answer
deleteUser
delete_user
fetch_answers
fetch_bookmarks
fetch_questions
profile
profilepic
response_topic
top_downanswers
top_upanswers
update_answer
update_profile
user_answers
user_login
user_signup
vote_answer
```
