var express = require('express'),
	bodyParser = require('body-parser'),
	busboy = require('connect-busboy'),
	dbRoutes = require('./server/dbRoutes').dbRoutes;

var app = express();

app.use(busboy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//adds the object uploading route to POST /upload/object
//adds the object accessing route to GET /object

dbRoutes(app);
app.use('/', express.static('dist'));

app.listen(8080);
