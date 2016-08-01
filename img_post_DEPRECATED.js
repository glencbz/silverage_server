var fs = require('fs'),
regImg = require('./regImg').regImg;

const ext = '.jpg';

function fileName(){
  return __dirname + '/upload_img/' + new Date().getTime() + ext;
}

function writeToFile(filePath, file, callback){
  var fstream = fs.createWriteStream(filePath);
  file.pipe(fstream);
  file.on('end', callback);
}

function imgPost(req, res){
  console.log('req received');
  var filePath = fileName();
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file){
    writeToFile(filePath, file, function(){
      var result = regImg(filePath);
      res.send(JSON.stringify(result));
    });
  });
}

function attachUpload(app){
	app.post('/upload', imgPost);
}

export {attachUpload, regImg};