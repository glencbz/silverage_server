var // express = require('express'),
  // bodyParser = require('body-parser'),
  fs = require('fs'),
  // busboy = require('connect-busboy'),
  execSync = require('child_process').execSync;

var ext = '.jpg';

function fileName(){
  return __dirname + '/upload_img/' + new Date().getTime() + ext;
}

function formatOutput(outputString){
  var lines = outputString.split('\n');

  lines = lines.filter(function(s){
    return s.charAt(0) == 'I';
  });
  lines = lines.map(function(s){
    return s.substr(s.indexOf(']') + 1).split(':');
  });
  lines = lines.map(function(strs){
    return [strs[0].substring(0, strs[0].indexOf('(')), parseFloat(rawStrs[1].trim())]
  });

  var result = {};
  for(var i = 0; i < lines.length; i++)
    result[lines[0]] = lines[1];

  return result;
}

function writeToFile(filePath, callback){
  fstream = fs.createWriteStream(filePath);
  file.pipe(fstream);
  file.on('end', callback());
}

function regImg(filePath){
  console.log('begin recognition');
  var rawResult = execSync('/home/glen/silverage/tensorflow/tensorflow/bazel-bin/tensorflow/examples/label_image/label_image', ['--graph=/home/glen/silverage/tensorflow/tensorflow/class_w10/graph.pb', '--labels=/home/glen/silverage/tensorflow/tensorflow/class_w10/labels.txt', '--output_layer=final_result','--image=' + filePath]);
  console.log('recognition done');
  return formatOutput(imgOutput);
}

export default function(app){
	app.post('/upload', function(req, res){
		console.log('req received');
		var fstream;
		req.pipe(req.busboy);
		req.busboy.on('file', function(fieldname, file){
      var filePath = fileName();
      writeToFile(filePath, function(){
        var result = regImg(filePath);
        res.send(JSON.stringify(result));
      });
		});
	});
}