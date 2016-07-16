import {SensorReading, ObjectLogger} from './itemTracker';
import colors from './colors';
import SensorGrid from './itemRenderer';
import ReactDOM from 'react-dom';
import React from 'react';

function flatIndex(array, i, j){
  return i * array[i].length + j;
}

function detectObjects(sensorArray){
  var newLog = trackObjects(sensorArray);
  addObject();
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

var objectLog = new ObjectLogger(colors.length);

var grid = ReactDOM.render(<SensorGrid height={5} 
                            width={7}
                            objects={Array.from(objectLog.objects)}/>, 
                            document.getElementById('sensor-grid'));

function newArdData(data){
  objectLog.updateValues(new SensorReading(data), grid.updateReading.bind(grid));
  // grid.updateReading(new SensorReading(data));
}

$(function(){
  // var $sensorCells = $('.sensor-cell');
  var $picBtn = $('#pic-btn');
  var $shownPic = $('#shown-pic');
  var $resultLabel = $('#result-label');

// arduino parsing function
  socket.on('ard', function (data) {
    var dataArray = JSON.parse(data);
    newArdData(dataArray);
    // colorCell(dataArray, $sensorCells);
  });


// button click animation
  $picBtn.click(function(){
    $picBtn.addClass('clicked');
    $resultLabel.html('');
    lastRequest = new Date().getTime();
    socket.emit('takepic', lastRequest);
    setTimeout(function(){
      $picBtn.removeClass('clicked');
    }, 100);
  });

// show picture after taking
  socket.on('showpic', function(fileName){
    $shownPic.css('background-image', 'url(' + fileName +'?' + new Date().getTime() + ')').addClass('active');
  });

// recognition result
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