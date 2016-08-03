const http = require('http'),
      express = require('express'),
      bodyParser = require('body-parser'),
      spawn = require('child_process').spawn,
      readline = require('readline'),
      request = require('request'),
      fs = require('fs'),
      takePic = require('./server/takePic'),
      imgReg = require('./server/imgReg'),
      fileName = 'static/tmp.jpg',
      postObj = require('./server/postObj');

var app = express();
var routes = require("./server/routes.js")(app);
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(bodyParser.urlencoded({extended: true}));
app.use('/', express.static('dist'));
app.use('/static', express.static('static'));

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
  var ard = spawn('python', ['-u', 'server/readserial.py']);
//  var ard = spawn('python', ['-u', 'dummy_arduino.py']);
  ard.stdout.setEncoding('utf8');

  var rl = readline.createInterface({
    input: ard.stdout
  });

  ard.stderr.setEncoding('utf8');
  ard.stderr.on('data', (data)=>{console.error(data);});
  rl.on('line', (data)=>{
    io.emit('ard', data);
//    console.log(JSON.parse(data).map(d => d.length).reduce((x,y) => x + y));
  });

  ard.on('close', ()=>{
    rl = undefined;
    spawnArd(socket);
  });

  socket.on('disconnect', () =>{
    ard.kill();
  });
}

io.on('connection', (socket) => {
  if (!ard)
    spawnArd(socket);

  socket.on('new_obj', (obj)=>{
    console.log('going to post an object', JSON.stringify(obj));
    postObj.add(fileName, obj, (res) =>{
      console.log(res);
    });
  });

  socket.on('del_obj', (obj)=>{
    console.log('object to be deleted', JSON.stringify(obj));
    postObj.del(null, obj, (res) =>{
      console.log(res);
    });
  });
  // var connTime = new Date().getTime();
  // var dirName = dirRoot + connTime;
  // fs.mkdir(dirName);

  // socket.on('takepic', (timeStamp)=>{
  //   var fileName = getFileName();
  // });  
});

takePic(fileName, () => {
  console.log('taken');
  imgReg(fileName, (result)=> {
    io.emit('img_reg', result.result);
  });
});

server.listen(80);
