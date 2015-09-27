

module.exports = function(app,passport,fs,db,ejs,request){


//read all teams
app.get('/',function(req,res){
	var template = fs.readFileSync('./views/index.html','utf8');
	var data; 
	db.all('SELECT threads.id, threads.votes, threads.name,threads.topic_id,threads.sqltime, threads.comments, topics.topic_name FROM threads,topics WHERE threads.topic_id = topics.id ORDER BY votes DESC;', function(err,rows){
		if(err){
			console.log(err);
		}else{
			console.log(rows);
			data = rows; 
			var rendered = ejs.render(template,{topics: data});
			res.send(rendered);
		}

	});

})


//once user is logged in 
app.get('/app/profile', ensureAuthenticated, function(req, res){
	var template = fs.readFileSync('./views/user.html','utf8');
	db.all('SELECT threads.id, threads.votes, threads.name,threads.topic_id,threads.sqltime, threads.comments, topics.topic_name FROM threads,topics WHERE threads.topic_id = topics.id ORDER BY votes DESC;', function(err,rows){
		if(err){
			console.log(err);
		}else{
			
			data = rows; 
			//append user data to the array
			data.facename = req.user.name;
			data.image = req.user.image;
			console.log(data);
			var rendered = ejs.render(template,{topics: data});
			res.send(rendered);
		}

	});
});


//read each specific topic
app.get('/app/topics/:id', ensureAuthenticated,function(req,res){
	var template = fs.readFileSync('./views/show_threads.html','utf8');
	var data; 
	db.all('SELECT threads.id, threads.votes, threads.topic_id, threads.name,threads.sqltime,topics.topic_name, threads.comments FROM threads,topics WHERE threads.topic_id = topics.id AND threads.topic_id = ? ORDER BY votes DESC;', req.params.id, function(err,rows){
		if(err){
			console.log(err);
		}else{
			console.log(rows);
			data = rows; 
			data.facename = req.user.name;
			data.image = req.user.image;
			var rendered = ejs.render(template,{topics: data});
			res.send(rendered);
		}

	});
})

//display top feed
app.get('/app/top', ensureAuthenticated,function(req,res){
	var template = fs.readFileSync('./views/show_threads.html','utf8');
	var data; 
	db.all('SELECT * FROM threads,topics WHERE threads.topic_id = topics.id ORDER BY votes DESC;', function(err,rows){
		if(err){
			console.log(err);
		}else{
			data = rows; 
			data.facename = req.user.name;
			data.image = req.user.image;
			var rendered = ejs.render(template,{topics: data});
			res.send(rendered);
		}

	});
})

//display specific thread
app.get('/app/topics/:id/threads/:idd',ensureAuthenticated,function(req,res){
	var template = fs.readFileSync('./views/show_topic.html','utf8');
	var data; 

	console.log(req.params.id);
	console.log(req.params.idd);
	db.get('SELECT threads.id,threads.name, threads.votes, threads.topic_id FROM threads,topics WHERE threads.topic_id = topics.id AND threads.id = ?', parseInt(req.params.idd), function(err,rows){
		if(err){
			console.log(err);
		}else{
			//get time, comment thread id
			db.all('SELECT comments.sqltime, comments.thread_id AS threadID, comments.id AS commentsID,comments.content,comments.location, comments.user_id, threads.name AS threadsname, threads.votes, threads.topic_id, users.user_id,users.name,users.image from comments,threads,users WHERE comments.thread_id = threads.id AND users.user_id = comments.user_id AND comments.thread_id = ?', parseInt(rows.id), function(err,rows2){
				data = rows2; 
				data.facename = req.user.name;
				data.image = req.user.image;
				console.log(rows2);
				console.log(rows);
				var rendered = ejs.render(template,{topics: data});
				res.send(rendered);
			})
		}

	});
});

//POST comments
app.post('/app/topics/:id/threads',ensureAuthenticated,function(req,res){
	var geolocation; 
	console.log("****************************POST COMMENT*******************")
	//make api call for geolocation
	request.get('http://ipinfo.io/json',function(err,response,body){
		console.log(body);
		var city;
		var region;
		var country;
		city = JSON.parse(body).city;
		region = JSON.parse(body).region;
		country = JSON.parse(body).country;
		geolocation = city + ", " + region + ", " +  country;
		console.log(geolocation);
		console.log(req.user.user_id);
		console.log(req.body.id);

	db.run("INSERT INTO comments (content,thread_id,location,user_id) VALUES (?,?,?,?)", req.body.content, parseInt(req.body.id), geolocation, req.user.user_id, function(err,rows){
	 		console.log(geolocation);
	 		if(err){
	 			console.log(err);
	 		}else{
	 			console.log("INSERTED");
	 			db.all("SELECT * FROM comments WHERE comments.thread_id = ?", parseInt(req.body.id), function(err,rows){

	 				console.log(rows.length);
	 				console.log(rows);
	 				//update number of comments
			 		db.run('UPDATE threads SET comments = ? WHERE threads.id = ?' , rows.length , parseInt(req.body.id), function(err,rows){
						if(err){
							console.log(err);
						}else{
							console.log(rows);
						}
		 			}); 


				});

			}
		});
		res.redirect('/app/topics/' + req.params.id + '/threads/' + req.body.id);
	});
});



//EDIT votes
app.put('/app/topics/:id/threads/:idd',ensureAuthenticated,function(req,res){
	var votes = parseInt(req.body.vote) + 1; //update vote by 1 each time request is sent

		db.run('UPDATE threads SET votes = ? WHERE threads.id = ?', votes , req.params.idd, function(err,rows){
			if(err){
				console.log(err);
			}else{
				console.log(rows);
			}
		});
		
})

//CREATE NEW THREAD

app.get('/app/topics/:id/new',ensureAuthenticated,function(req,res){
	console.log("hit")
	var template = fs.readFileSync('./views/create.html','utf8');
	var data; 
	db.all('SELECT * FROM threads,topics WHERE threads.topic_id = topics.id AND topics.id = ? ORDER BY votes DESC;',req.params.id, function(err,rows){
		if(err){
			console.log(err);
		}else{
			console.log(rows);
			data = rows; 
			data.facename = req.user.name;
			data.image = req.user.image;
			var rendered = ejs.render(template,{topics: data});
			res.send(rendered);
		}

	});
});


app.post('/app/topics', ensureAuthenticated, function(req,res){
	db.run("INSERT INTO threads (name,votes,topic_id,comments) VALUES (?,?,?,?)", req.body.name, 0, req.body.topic_id,1, function(err,rows){
	 		if(err){
	 			console.log(err);
	 		}else{
	 			//get the thread ID
	 			db.get("SELECT threads.id FROM threads WHERE threads.name = ?", req.body.name,function(err,rows){
	 				var threadID = rows.id;
	 				console.log("INSERTED thread");
	 				console.log(threadID);
	 				//insert comment
				 			db.run("INSERT INTO comments (content,thread_id,user_id) VALUES (?,?,?)", req.body.content,threadID ,req.user.user_id, function(err,rows){
					 		if(err){
					 			console.log(err);
					 		}else{
					 			console.log("INSERTED comments");

							}
					});
	 			})
	 			

			}
		});
	
		res.redirect('/app/topics/' + req.body.topic_id);
});



//FACEBOOK ROUTES
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'basic_info']}));

app.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', { successRedirect: '/app/profile',
	                                      failureRedirect: '/' }));
//checks if user is logged in
function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	console.log("redirected");
	res.redirect('/');
}

};




