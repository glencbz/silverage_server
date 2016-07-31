var express = require('express'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	busboy = require('connect-busboy'),
	spawn = require('child_process').spawn;

var app = express();


app.use(busboy());

img_post = require('./img_post')(app);

//test mongoDB

require('./object_db.js');

app.listen(8080);
