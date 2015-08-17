
# SPORA - Sports Forum
Spora is a sports forum that allows users to create threads to discuss about different sports(basektball, soccer, baseball).Users can post comments on certain threads as well as vote on.
## User Specifications/Stories
<li>1.User goes to Home Page</li>
<li>2.User sees list of threads categorized by topics</li>
<li>3.User can login and create a new thread by adding a thread title and a comments</li>
<li>4.User can also view existing threads and comment on the existing thread</li>
## Wireframes/Mockups
![Mockup1](./resources/mockup1.png)
![Mockup1](./resources/mockup2.png)
![Mockup1](./resources/mockup3.png)

## Routes
Routes:

<li>app.get("/")</li>
<li>app.get("/topics/:id/threads")</li>
<li>app.get("/topics/:id/threads/:id2")</li>
<li>app.get("/topics/:id/threads/")</li>
<li>app.get("/topics/:id/threads/new")</li>
<li>app.post("/topics/:id/threads")</li>
<li>app.put('/topics/:id/threads/:idd'</li>
<li>app.get('/topics/:id/new'</li>

##Pseudocode
<h3>Backend pseudocode:</h3>


//read all teams<br>
1. get the routes<br>
2. read template (index.html)<br>
3. get data from threads table<br>
4. render data to ejs template.<br>

//read specific topic<br>
1. get the route /app/topics/:id<br>
2. get data from threads and topics table (JOIN)<br>
3. append user data (from facebook session) to data retrieved from database<br>
4. render data through ejs<br>


//display top feed<br>
1.get the route '/app/top'<br>
2. read show_threads.html<br>
3. get data from threads table and rank them by votes<br>
4. render data through ejs<br>

//display specific thread<br>
1. get the route /app/topics/:id/threads/:idd<br>
2.read show_topic.html<br>
3. get threads data from database<br>
4. get data from comments and threads table in which the threads id is equal to the comments id<br>
5.render data through ejs<br>



//POST comments<br>
1. post on the route /app/topics/:id/threads<br>
2. get geolocation by making api call to http://ipinfo.io/json<br>
3. insert into comments table<br>
4. update number of votes accordingly<br>
5. redirect user to home page<br>

//edit votes<br>
1. send put request to '/app/topics/:id/threads/:idd'<br>
2. update the data in the threads table (add one to vote each time thumbs icon is clicked)<br>
3. redirect user to threads page<br>


//CREATE NEW THREAD<br>
1. get the route '/app/topics/:id/new'<br>
2. read create.html file<br>
3. display form to user through ejs<br>


//CREATE NEW THREAD<br>
1. send post request to /app/topics<br>
2. insert into threads table with the form data retrieved from user<br>
3. insert into comments table with the comments the user wrote<br>
4. redirect user back to topics page<br>






## Database Design
![Mockup1](./resources/forum_ERD.png)
## Credits
Libraries:
<p>
Node.js, express.js, passport.js
</p>
Repository used: 
<p>
https://github.com/jaredhanson/passport-facebook
</p>


