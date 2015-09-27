DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS threads;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS comments;



CREATE TABLE topics(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	topic_name varchar(255) 

);

CREATE TABLE threads(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name varchar(255),
	votes INTEGER,
	topic_id INTEGER,
	sqltime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	comments INTEGER,
	user_id INTEGER
);

CREATE TABLE users(
	id INTEGER PRIMARY KEY,
	user_id INTEGER,
	access_token varchar(255),
	name varchar(255),
	email varchar(255),
	image text
);

CREATE TABLE comments(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	content TEXT,
	location varchar(255),
	sqltime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	thread_id INTEGER,
	user_id INTEGER
);

-- Insert Topics 
INSERT INTO topics (topic_name) VALUES ('Basketball'),('Baseball'),('Soccer');
-- Insert Threads
INSERT INTO threads (name,votes,topic_id,comments) 
VALUES ('Alex Rodriguez Comeback',2,2,1),('Kevin Durant for MVP',55,1,1),
('Steph curry vs Lebron James',14,1,1),('Lakers and Phil Jackson',6,1,1),
('Lionel messi going to real madrid',7,3,1),('Kobe Bryant makes a return for MVP',49,1,1);



INSERT INTO comments (content,thread_id,location,user_id)
VALUES('no wayyyyyyyyyyyyyyyyyy waht is going on', 1,'New York, New York',10155879467195627),('no wayyyyyyyyyyyyyyyyyy waht is going on', 2,'New York, New York',10155879467195627),('testing number 2', 3,'New York, New York',10155879467195627),('waht is going on', 4,'New York, New York',10155879467195627)
,('waht is going on', 5,'New York, New York',10155879467195627),('waht is going on', 6,'New York, New York',10155879467195627);






