const http = require('http'),
      express = require('express'),
      bodyParser = require('body-parser'),
      spawn = require('child_process').spawn,
      readline = require('readline');

var app = express();
var routes = require("./routes.js")(app);
var server = http.createServer(app)
var io = require('socket.io')(server);

app.use(bodyParser.urlencoded({extended: true}));

// var dumArd = spawn('python', ['dummy_arduino.py']);
// dumArd.stdout.setEncoding('utf8');

// var rl = readline.createInterface({
//   input: dumArd.stdout
// });

rl.on('line', (data)=>{
  var t = new Date().getTime();
  io.emit('ard', JSON.stringify({
    data: data,
    time: t
  }));
});

io.on('connection', (socket) =>{
  socket.emit('news', {hello: 'world'});
});

server.listen(5000);