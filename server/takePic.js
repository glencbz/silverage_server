const spawn = require('child_process').spawn,
    chokidar = require('chokidar'),
    readline = require('readline'),
    path = require('path');

function initInput(){
  return spawn('python', ['-u', '/home/pi/Documents/Silverage/silverage_pi/server/zx_sensor/proximityState.py']);
}

function initCamera(fileName){
  return spawn('raspistill', ['-s', '-o', fileName, '-t', 0, '-ss', 1900]);
}

function takePic(fileName, callback){
//  var fileCount = 0;

  fileName = path.join(__dirname, "../static",  fileName);
  var picTaker = initCamera(fileName);
//  var picTaker = spawn('python', ['-u', 'pictureTaker.py']);
  var light = spawn('python', ['-u', path.join(__dirname, 'light.py')]);

  var inputSource = initInput();

  picTaker.stderr.setEncoding('utf8');
  picTaker.stdout.setEncoding('utf8');
  light.stderr.setEncoding('utf8');
  light.stdout.setEncoding('utf8');
  inputSource.stderr.setEncoding('utf8');
  inputSource.stdout.setEncoding('utf8');

  picTaker.stderr.on('data', data => console.error(data));
  light.stderr.on('data', data => console.error(data));
  picTaker.stdout.on('data', data => console.log(data));
  inputSource.stderr.on('data', data => console.error(data));
  inputSource.stdout.on('data', data => console.log(data));

  inputSource.stdout.setEncoding('utf8');
  console.log('zx sensor input intialised');
  
  var inputrl = readline.createInterface({
    input: inputSource.stdout
  });
  
  var lightrl = readline.createInterface({
    input: light.stdout
  });

  inputrl.on('line', (data) => {
//    console.log(data);
    if (data == 'IN'){
      light.stdin.write('ON\n');
    }
  });
 
  lightrl.on('line', (data) => {
//    console.log(data);
    if (data == 'ON'){
      picTaker.kill('SIGUSR1');
//      picTaker.stdin.write(fileName + '\n');
      console.log('pic taking attempted');
    }
  });

  var watchedPath = path.dirname(fileName);
  var watcher = chokidar.watch(watchedPath, {persistent: true});

//  console.log(watchedPath);
  watcher.on('change', path => {
    console.log(path);
    if (path === fileName){
      light.stdin.write('OFF\n');
 //     picTaker.kill();
      callback();
    }
  });
}

module.exports = takePic;

if (require.main === module){
  var fileName = 'test.jpg';
  takePic(fileName, () => {
    console.log('taken');
  });
}
