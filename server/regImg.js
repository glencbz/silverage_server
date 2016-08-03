var spawnSync = require('child_process').spawnSync,
    fs = require('fs');

function writeToFile(filePath, file, callback){
  var fstream = fs.createWriteStream(filePath);
  file.pipe(fstream);
  file.on('end', callback);
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
  var result = {};
  for(var i = 0; i < lines.length; i++)
    result[lines[i][0]] = lines[i][1];

  return result;
}

function singleClassOutput(resultObj){
  var classification;
  for (var key in resultObj){
    if (resultObj[key] > 0.3){
      if (classification){
        return {};
      }
      classification = key;
    }
  }
  return {result: classification};
}

function regImg(filePath){
  console.log('begin recognition');
  console.log(filePath);
  var rawResult = spawnSync('/home/glen/silverage/tensorflow/tensorflow/bazel-bin/tensorflow/examples/label_image/label_image', ['--graph=/home/glen/silverage/tensorflow/tensorflow/class_w10/graph.pb', '--labels=/home/glen/silverage/tensorflow/tensorflow/class_w10/labels.txt', '--output_layer=final_result', '--image=' + filePath]).stderr.toString();
  console.log('recognition done');
  return singleClassOutput(formatOutput(rawResult));
}

function imgEndpoint(app){
  var imgPath = 'tmp.jpg';
  app.post('/imgreg', (req, res)=>{
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file){
      writeToFile(imgPath, file, function(){
        var result = regImg(imgPath);
        res.send(result);
      });
    });
  })
}
module.exports= {regImg, imgEndpoint};
