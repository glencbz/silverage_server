const spawn = require('child_process').spawn,
    chokidar = require('chokidar'),
    readline = require('readline'),
    path = require('path');

function initInput(){
  return spawn('python', ['-u', 'server/zx_sensor/sensorread.py']);
}

function takePic(fileName, callback){
  fileName = path.join(process.cwd(), fileName);
  var picTaker = spawn('raspistill', ['-s', '-o', fileName, '-t', 0]);

  var inputSource = initInput();

  picTaker.stderr.setEncoding('utf8');
  picTaker.stdout.setEncoding('utf8');

  picTaker.stdout.on('data', data => console.log(data));
  picTaker.stderr.on('data', data => console.error(data));

  inputSource.stdout.setEncoding('utf8');
  console.log('zx sensor input intialised');
  console.log(fileName);
  
  var rl = readline.createInterface({
    input: inputSource.stdout
  });

  rl.on('line', (data) => {
    console.log(data);
    if (data == 'IN'){
      picTaker.kill('SIGUSR1');
      console.log('pic taking attempted');
    }
  });
  var watchedPath = path.dirname(fileName);
  var watcher = chokidar.watch(watchedPath, {persistent: true});

  console.log(watchedPath);
  watcher.on('change', path => {
    // console.log(fileName);
    if (path === fileName)
      callback();
  });
}

module.exports = takePic;

if (require.main === module){
  var fileName = 'test.jpg';
  takePic(fileName, () => {
    console.log('taken');
  });
}
