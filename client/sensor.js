// returns a log of how many cycles a cell has been logged while ignoring current objects 
var sensorObjects = [];
var sensorLog = [[0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0]]

var objectThreshold = 10;


function flatIndex(array, i, j){
  return i * array[i].length + j;
}

function detectObjects(sensorArray){
  var newLog = trackObjects(sensorArray);
  addObject();
}

// returns a log of how many cycles a cell has been logged while ignoring current objects
function trackObjects(sensorArray){
  for(var i = 0; i < sensorLog.length; i++){
    console.log(i, sensorArray[i]);
    for(var j = 0; j < sensorLog[i].length; j++){
      if(sensorArray[i][j])
        sensorLog[i][j] += 1;
      else
        sensorLog[i][j] = 0;
    }
  }
  for(var i = 0; i < sensorObjects.length; i++){
    for (var i = 0; j < sensorObjects[i].indices.length; j++){
      console.log(sensorObjects[i]);
      var index = sensorObjects[i].indices[j];
      sensorLog[index[0]][index[1]] = 0;
    }
  }
}

function addObject(){
  var newObject = {indices: []};
   for(var i = 0; i < sensorLog.length; i++){
    for(var j = 0; j < sensorLog[i].length; j++){
      if (sensorLog[i][j] >= objectThreshold)
        newObject.indices.push([i,j]);
    }
  }

  if (newObject.indices != false)
    sensorObjects.push(newObject);
}

function colorObjects($sensorCells){
  for (var i = 0; i < sensorObjects.length; i++){
    for (var j = 0; j < sensorObjects[i].indices.length; j++){
      var ind = flatIndex($sensorCells, sensorObjects[i].indices[j][0], sensorObjects[i].indices[j][1]);
      $($sensorCells[ind]).css('background-color', 'tomato');
    }
  }
}

function colorCell(arrayChoices, $sensorCells){
  for (var i = 0; i < arrayChoices.length; i++){
    for (var j = 0; j < arrayChoices[i].length; j++){
      var index = flatIndex(arrayChoices, i, j);
      if (arrayChoices[i][j] == 0)
        $($sensorCells[index]).css('background-color', 'white');
      else
        $($sensorCells[index]).css('background-color', 'rgb(' + (255 - arrayChoices[i][j]) + ',0,0');
    }
  }
}

var socket = io.connect(window.location.href);
var lastRequest = undefined;

$(function(){
  var $sensorCells = $('.sensor-cell');
  var $picBtn = $('#pic-btn');
  var $shownPic = $('#shown-pic');
  var $resultLabel = $('#result-label');

  socket.on('ard', function (data) {
    var dataArray = JSON.parse(data);
    colorCell(dataArray, $sensorCells);
//    if (dataArray != '')
//      detectObjects(dataArray);
//    colorObjects($sensorCells);
  });

  $picBtn.click(function(){
    $picBtn.addClass('clicked');
    $resultLabel.html('');
    lastRequest = new Date().getTime();
    socket.emit('takepic', lastRequest);
    setTimeout(function(){
      $picBtn.removeClass('clicked');
    }, 100);
  });

  socket.on('showpic', function(fileName){
    $shownPic.css('background-image', 'url(' + fileName +'?' + new Date().getTime() + ')').addClass('active');
  });

  socket.on('reg_result', function(result){
    if (lastRequest != result.timeStamp){
      console.log(result.timeStamp, lastRequest);
      return;
    }
    var lines = result.result.split('\n');
    var labelScores = lines.map((d)=>{
      var rawStrs = d.split(':');
      rawStrs[0] = rawStrs[0].substring(0, rawStrs[0].indexOf('('));
      rawStrs[1] = parseFloat(rawStrs[1].trim());
      return rawStrs
    });
    console.log(labelScores)
    labelScores = labelScores.filter((d)=>{
      return d[1] > .5;
    });
    console.log(labelScores);
    labelScores = labelScores != '' ? labelScores : 'Nothing detected!';
    console.log(result);
    $resultLabel.html(labelScores);
  });
});
