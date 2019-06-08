# Community Q&A Platform (Prototype of Quora)
Project for CmpE 273 Course Lab in the Spring 19 semester at San Jose State University

## Project Description
The application is an open-source question-and-answer platform, inspired by Quora (www.quora.com). It supports majority of functionalities presented by the actual website such as, asking a question, answering a question, following & unfollowing users-topics-questions, a 'Your content' page that shows various interesting analytics about the users' posts and interactions with the platform, P2P messaging, real-time notifications, and so on. The application is developed majorly using the MERN stack technologies (MongoDB, ExpressJS, ReactJS and NodeJS) and is made highly scalable and available using the 3-tier distributed system paradigm with fault tolerance and load balancing using the AWS EC2 and ELB, with real-time data pipelining and streaming on Kafka middleware.

<p align="middle">
  <img src="/app-screenshots/quora_1-thumbnail.PNG" width="400" />
  <img src="/app-screenshots/quora_3-thumbnail.PNG" width="400" />
  <img src="/app-screenshots/quora_4-thumbnail.PNG" width="400" />
  <img src="/app-screenshots/quora_2-thumbnail.PNG" width="400" /> 
</p>
 
 
### System Architechture
![](https://github.com/shreyamkela/quora-app/blob/master/system_architechture-thumbnail.JPG)


### Technologies utilized
React, Redux, Node.js, Express.js, Kafka, Zookeeper, JavaScript, HTML5, CSS3, Bootstrap, Ant Design, AWS EC2 ELB RDS, Firebase, MySQL, MongoDB, Redis, Mongoose, ORM, Bcrypt, JWT, REST

### Build instructions to run the project on localhost:  
1) Install Kafka and Zookeeper. Create the below topics in Kafka:
```
__consumer_offsets, activity, add_answer, add_question, answer_comment, bookmark_answer, deleteUser, delete_user, fetch_answers, fetch_bookmarks, fetch_questions, profile, profilepic, response_topic, top_downanswers, top_upanswers, update_answer, update_profile, user_answers, user_login, user_signup, vote_answer
```
2) Create MongoDB database - Quora_Db.
3) Create MySQL table - Users (Email varchar(100), Password varchar(100), Primary Key(Email)).   
4) Open a terminal:  
    - cd frontend  
    - npm install  
    - npm start  
5) Open a second terminal:  
    - cd backend  
    - npm install  
    - node index.js  
6) Open a third terminal:  
    - cd Kafka    
    - npm install  
    - npm start  

### Team Members
Shreyam Kela, Ajay Chauhan, Vandana Shenoy, Swati Shukla, Shravani Pande, Rakhee Singh

