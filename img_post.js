var // express = require('express'),
  fs = require('fs'),
  spawnSync = require('child_process').spawnSync;


var ext = '.jpg';

function fileName(){
  return __dirname + '/upload_img/' + new Date().getTime() + ext;
}

function formatOutput(outputString){
  console.log(outputString);
  var lines = outputString.split('\n');
  lines = lines.filter(function(s){
    return s.charAt(0) == 'I';
  });
  lines = lines.map(function(s){
    return s.substr(s.indexOf(']') + 1).split(':');
  });
  lines = lines.map(function(strs){
    return [strs[0].substring(0, strs[0].indexOf('(')).trim(), parseFloat(strs[1].trim())]
  });
  console.log("lines1", lines);
  var result = {};
  for(var i = 0; i < lines.length; i++)
    result[lines[i][0]] = lines[i][1];

  return result;
}

function writeToFile(filePath, file, callback){
  var fstream = fs.createWriteStream(filePath);
  file.pipe(fstream);
  file.on('end', callback);
}

function regImg(filePath){
  console.log('begin recognition');
  console.log(filePath);
  var rawResult = spawnSync('/home/glen/silverage/tensorflow/tensorflow/bazel-bin/tensorflow/examples/label_image/label_image', ['--graph=/home/glen/silverage/tensorflow/tensorflow/class_w10/graph.pb', '--labels=/home/glen/silverage/tensorflow/tensorflow/class_w10/labels.txt', '--output_layer=final_result', '--image=' + filePath]).stderr.toString();
  console.log('recognition done');
  return formatOutput(rawResult);
}

module.exports=function(app){
	app.post('/upload', function(req, res){
		console.log('req received');
		req.pipe(req.busboy);
		req.busboy.on('file', function(fieldname, file){
      var filePath = fileName();
      writeToFile(filePath, file, function(){
        var result = regImg(filePath);
        res.send(JSON.stringify(result));
      });
		});
	});
}
