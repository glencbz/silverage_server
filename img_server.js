var express = require('express'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	busboy = require('connect-busboy');

var app = express();
app.use(busboy());

img_post = require('img_post')(app);
app.listen(8080);
