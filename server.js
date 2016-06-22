const http = require('http'),
      express = require('express'),
      bodyParser = require('body-parser'),
      spawn = require('child_process').spawn,
      readline = require('readline'),
      request = require('request'),
      picName = 'client/tmp.jpg';

var app = express();
var routes = require("./routes.js")(app);
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(bodyParser.urlencoded({extended: true}));
app.use('/client', express.static('client'));

// dummy arduino testing
var ard = spawn('python', ['-u', '/home/pi/Documents/Silverage/sensorSerial.py']);
ard.stdout.setEncoding('utf8');

var rl = readline.createInterface({
  input: ard.stdout
});

ard.stderr.setEncoding('utf8');
ard.stderr.on('data', (data)=>{
  console.log(data);
});

// video stream testing
//var vidStream = spawn('raspivid', ['-t 30000 -o -', '| nc -l', 3333]);
//vidStream.on('error', ()=>{
//  console.log('euuhhhh');
//});

rl.on('line', (data)=>{
  io.emit('ard', data);
});

io.on('connection', (socket) => {
  var sendFile = require('./send_img.js')(socket);
  socket.on('takepic', ()=>{
    var picTaker = spawn('raspistill', ['-o', picName]);
    console.log('pic taking');
    picTaker.on('close', ()=>{
      socket.emit('showpic', picName);
      console.log('pic taken');
      sendFile(picName);
    });
  })
});

server.listen(5000);
