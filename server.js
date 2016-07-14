const http = require('http'),
      express = require('express'),
      bodyParser = require('body-parser'),
      spawn = require('child_process').spawn,
      readline = require('readline'),
      request = require('request'),
      picName = 'client/tmp.jpg';

var app = express();
var routes = require("./server/routes.js")(app);
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(bodyParser.urlencoded({extended: true}));
app.use('/', express.static('dist'));

function spawnArd(){
  // var ard = spawn('python', ['-u', '/home/pi/Documents/Silverage/readserial.py']);
  var ard = spawn('python', ['-u', 'dummy_arduino.py']);
  ard.stdout.setEncoding('utf8');

  var rl = readline.createInterface({
    input: ard.stdout
  });

  ard.stderr.setEncoding('utf8');
  ard.stderr.on('data', (data)=>{
    console.log(data);
  });

  rl.on('line', (data)=>{
    io.emit('ard', data);
    console.log(data);
  });

  ard.on('close', ()=>{
    rl = undefined;
    spawnArd();
  });
}

spawnArd();

io.on('connection', (socket) => {
  var sendFile = require('./server/send_img.js')(socket);
  socket.on('takepic', (timeStamp)=>{
    var picTaker = spawn('raspistill', ['-o', picName]);
    console.log('pic taking');
    picTaker.on('close', ()=>{
      socket.emit('showpic', picName);
      console.log('pic taken');
      sendFile(picName, timeStamp);
    });
  })
});

server.listen(5000);
