import 'bulma';
import '../../globals/sensor.scss';
import io from 'socket.io-client';
import ReactDOM from 'react-dom';
import React from 'react';
import {SensorReading, ObjectLogger} from './itemTracker';
import colors from './colors';
import {updatingChart, addData} from './updatingChart';
import SensorGrid from './itemRenderer';
import {sensorDims} from './sensorDims';
import {ObjectList} from './objectList';

// import $ from 'jquery';

function flatIndex(array, i, j){
  return i * array[i].length + j;
}

var socket = io.connect(window.location.href);
var lastRequest;

var objectLog = new ObjectLogger(colors.length);

var grid = ReactDOM.render(<SensorGrid height={sensorDims.height} 
                            width={sensorDims.width}
                            />, 
                            document.getElementById('sensor-grid'));

var objectList =  ReactDOM.render(<ObjectList/>, document.getElementById('item-list'));

function newArdData(data){
  objectLog.updateValues(data, (reading, objectArr) =>{
    grid.updateReading.bind(grid)(reading, objectArr);
    objectList.updateObjects.bind(objectList)(objectArr);
  });
}

$(function(){

  var main = document.getElementById('main');
  main.addEventListener('click', ()=>{
    if (main.requestFullscreen) {
      main.requestFullscreen();
    } else if (main.webkitRequestFullscreen) {
      main.webkitRequestFullscreen();
    } else if (main.mozRequestFullScreen) {
      main.mozRequestFullScreen();
    } else if (main.msRequestFullscreen) {
      main.msRequestFullscreen();
    }
  });

  main.addEventListener('touchstart', ()=>{
    if (main.requestFullscreen) {
      main.requestFullscreen();
    } else if (main.webkitRequestFullscreen) {
      main.webkitRequestFullscreen();
    } else if (main.mozRequestFullScreen) {
      main.mozRequestFullScreen();
    } else if (main.msRequestFullscreen) {
      main.msRequestFullscreen();
    }
  });

  var $picBtn = $('#pic-btn');
  var $shownPic = $('#shown-pic');
  var $resultLabel = $('#result-label');
  var readingCount = 0;

// arduino parsing function
  socket.on('ard', function (data) {
    console.log("counts", readingCount);
    readingCount++;
    var dataArray = JSON.parse(data);
    console.log("data", data, dataArray);
    var newReading = new SensorReading(dataArray);
    console.log('reading', newReading);
    if (isNaN(newReading.weight))
        return;
    newArdData(newReading);
    console.log("new chart data", readingCount, newReading);
    addData(newReading.weight);
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
    objectLog.updateImages(fileName);
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
