var express = require('express'),
	bodyParser = require('body-parser'),
	busboy = require('connect-busboy'),
	objPost = require('./server/object_db').objPost;

var app = express();

app.use(busboy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
objPost(app);

require('./object_db.js');

app.listen(8080);
