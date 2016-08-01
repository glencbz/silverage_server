const http = require('http'),
      express = require('express'),
      bodyParser = require('body-parser'),
      spawn = require('child_process').spawn,
      readline = require('readline'),
      request = require('request'),
      fs = require('fs'),
      takePic = require('./server/takePic'),
      imgReg = require('./server/imgReg.js'),
      fileName = 'server/tmp.jpg';

var app = express();
var routes = require("./server/routes.js")(app);
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(bodyParser.urlencoded({extended: true}));
app.use('/', express.static('dist'));

var ard;
function spawnArd(socket){
  ard = spawn('python', ['-u', 'dummy_arduino.py']);
  // var ard = spawn('python', ['-u', 'server/readserial.py']);
  ard.stdout.setEncoding('utf8');

  var rl = readline.createInterface({
    input: ard.stdout
  });

  ard.stderr.setEncoding('utf8');

  rl.on('line', (data)=>{
    io.emit('ard', data);
    console.log(data);
  });

  // ard.on('close', ()=>{
  //   rl = undefined;
  //   spawnArd(socket);
  // });

  socket.on('disconnect', () =>{
    ard.kill();
    ard = undefined;
  });
}

io.on('connection', (socket) => {
  if (!ard)
    spawnArd(socket);
  // var connTime = new Date().getTime();
  // var dirName = dirRoot + connTime;
  // fs.mkdir(dirName);

  // socket.on('takepic', (timeStamp)=>{
  //   var fileName = getFileName();
  // });  


  // takePic(fileName, ()=>{
  //   socket.emit('showpic', fileName);
  //   // console.log('pic taken', fileName);
  //   imgReg(fileName, (body) =>{
  //     socket.emit('reg_result', {
  //       result: body
  //     });
  //   });
  // });
});

/*takePic(fileName, ()=>{
  console.log('pic taken', fileName);
  imgReg(fileName, (body) =>{
    console.log(body);
  });
});*/

socket.on('new_obj', (obj)=>{

});
socket.on('del_obj', (obj)=>{
  
});

server.listen(80);
