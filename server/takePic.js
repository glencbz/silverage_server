const spawn = require('child_process').spawn,
    fs = require('fs');

function initInput(){
  //TODO: add actual input
  return spawn('whatever the file path is');
}

function takePic(fileName, callback){
  var picTaker = spawn('raspistill', ['-s', '-o', fileName]);
  var inputSource = initInput();

  var rl = readline.createInterface({
    input: inputSource.stdout
  });
  
  rl.on('line', (data) => {
    if (data == 'IN')
      picTaker.kill('USR1');
  });

  fs.watch(fileName, callback);
}

module.exports = takePic;