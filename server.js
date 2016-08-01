const http = require('http'),
      express = require('express'),
      bodyParser = require('body-parser'),
      spawn = require('child_process').spawn,
      readline = require('readline'),
      request = require('request'),
      fs = require('fs'),
      takePic = require('./server/takePic'),
      imgReg = require('./server/imgReg'),
      fileName = 'server/tmp.jpg',
      postObj = require('./server/postObj');

var app = express();
var routes = require("./server/routes.js")(app);
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(bodyParser.urlencoded({extended: true}));
app.use('/', express.static('dist'));

// takePic(fileName, ()=>{
//   io.emit('pic_taken', fileName);
//   // console.log('pic taken', fileName);
//   imgReg(fileName, (body) =>{
//     socket.emit('reg_result', {
//       result: body
//     });
//   });
// });

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
    // console.log(data);
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

  socket.on('new_obj', (obj)=>{
    console.log('going to post an object', JSON.stringify(obj));
    postObj(fileName, obj, (res) =>{
      console.log(res);
    });
  });

  socket.on('del_obj', (obj)=>{
    console.log('object to be deleted', obj);
  });
  // var connTime = new Date().getTime();
  // var dirName = dirRoot + connTime;
  // fs.mkdir(dirName);

  // socket.on('takepic', (timeStamp)=>{
  //   var fileName = getFileName();
  // });  
});

/*takePic(fileName, ()=>{
  console.log('pic taken', fileName);
  imgReg(fileName, (body) =>{
    console.log(body);
  });
});*/

server.listen(80);
