// esversion: 6
import 'bulma';
import '../../globals/sensor.scss';
import io from 'socket.io-client';
import ReactDOM from 'react-dom';
import React from 'react';
import {SensorReading, ObjectLogger} from './itemTracker';
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

var objectLog = new ObjectLogger(socket);

var grid = ReactDOM.render(<SensorGrid height={sensorDims.height} 
                            width={sensorDims.width}
                            />, 
                            document.getElementById('sensor-grid'));

var objectList =  ReactDOM.render(<ObjectList fileName='tmp.jpg'/>, document.getElementById('item-list'));

function newArdData(data){
  objectLog.updateValues(data, (reading, objectArr) =>{
    grid.updateReading.bind(grid)(reading, objectArr);
    objectList.updateObjects.bind(objectList)(objectArr);
  });
}

var main = document.getElementById('main');

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





