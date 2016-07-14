/*
Item tracking pseudocode:

1. Maintain a steady-state reading by averaging over previous cycles

2. Diff new reading with avg, if new reading < THRESHOLD, Update average by 
avg = (avg + newVal) * (n)/(n-1)

3. Else, if reading >= threshold, begin tracking new steady-state for x cycles

4. After x cycles, diff original state with new state to obtain readings specific to object

*/

import _ from 'lodash';

const sensorDims = [7, 5];

class SensorReading{
  static createNewReading(){
    return _.chunk(_.times(sensorDims[0] * sensorDims[1], _.constant(0)), sensorDims[1]);
  }

  constructor(readings){
    if (!readings)
      this.readings = this.createNewReading();
    else
      this.readings = readings;
  }  

  averageNewReading(newReading, timeStep){
    var avgScale = timeStep / (timeStep + 1);
    var newAvg = this.createNewReading();
    for (var i = 0; i < sensorDims[0]; i ++)
      for (var j = 0; j < sensorDims[1]; j++)
        newAvg[i][j] = avgScale * (newReading.readings[i][j] + this.readings[i][j]);
    return new SensorReading(newAvg);
  }

  diffReading(otherReading){
    var diff = this.createNewReading();
    for (var i = 0; i < sensorDims[0]; i ++)
      for (var j = 0; j < sensorDims[1]; j++)
        diff[i][j] = this.readings[i][j] - newReading.readings[i][j];
    return new SensorReading(diff);
  }

  reduceDiffReadings(otherReading, add=true){
    var sum = 0;
    var op;
    if (add)
      op = _.add;
    else
      op = _.subtract;

    for (var i = 0; i < sensorDims[0]; i ++)
      for (var j = 0; j < sensorDims[1]; j++)
        sum += Math.abs(op(newReading.readings[i][j], this.readings[i][j]));
    return sum;
  }

  sumOverSelf(){
    var sum = 0;
    for (var i = 0; i < sensorDims[0]; i ++)
      for (var j = 0; j < sensorDims[1]; j++)
        sum += this.readings[i][j];
    return sum; 
  }
}

class TestCycle{
  constructor(initialReading){
    this.testingAvg = initialReading,
    this.testingCount = 1,
    this.numTestCycles = 10;
  }

  objectTestCycle(){
    // if we are not done testing for an object
    if (this.testingCount < this.numTestCycles){
      this.testingAvg = this.testingAvg(newReading, this.testingCount);
      this.testingCount += 1;
      return undefined;
    }
    else
      return new SensorReading(testingAvg);
  }
}

class ObjectLogger {
  constructor(){
    this.newObjectThreshold = 10,
    // this.similarObjectThreshold = 10,
    this.readingCount = 0,
    this.avgReading = SensorReading.createNewReading(),
    this.testCycle = undefined,
    this.objects = new Set();
  }

  updateValues(newReading){
    // if not currently testing for a new object
    if (!this.testCycle){
      var newAvg = avgReading.averageNewReading(newReading, this.readingCount);
      // if the difference in readings is less than the threshold for a new object
      if (avgReading.reduceDiffReadings(newAvg, true) < newObjectThreshold){
        this.readingCount += 1;
        this.avgReading = newAvg;
      }
      // if the difference in readings is not less than the threshold for a new object
      else
        this.testCycle = new TestCycle(newReading);
    }
    else{
      var testResult = this.testCycle.test(newReading);
      updateObjects(testResult);
    }
  }
  
  updateObjects(testResult){
    if (!testResult)
      return undefined;

    this.readingCount = 1;
    this.avgReading = testResult;

    var testMagnitude = testResult.sumOverSelf();
    if (testMagnitude > newObjectThreshold)
      this.objects.add(testResult);
    else if (testMagnitude < -newObjectThreshold){
      var closestObject = _.minBy(Array.from(this.objects), x => x.reduceDiffReadings(testResult, false));
      this.objects.delete(closestObject);
    }
  }
}

/*// returns a log of how many cycles a cell has been logged while ignoring current objects
function flatIndex(array, i, j){
  return i * array[i].length + j;
}

function trackObjects(sensorArray){
  for(var i = 0; i < sensorLog.length; i++){
    for(var j = 0; j < sensorLog[i].length; j++){
      if(sensorArray[i][j])
        sensorLog[i][j] += 1;
      else
        sensorLog[i][j] = 0;
    }
  }
  for(var i = 0; i < sensorObjects.length; i++){
    for(var j = 0; i < sensorObjects[i].indices.length; j++){
      var index = sensorObjects[i].indices[j];
      sensorLog[index[0]][index[1]] = 0;
    }
  }
}*/

/*function addObject(){
  var newObject = {indices: []};
   for(var i = 0; i < sensorLog.length; i++){
    for(var j = 0; j < sensorLog[i].length; j++){
      if (log[i][j] >= objectThreshold)
        newObject.indices.push([i,j]);
    }
  }

  if (newObject.indices != false)
    sensorObjects.push(newObject);
}*/

/*function colorObjects($sensorCells){
  for (var i = 0; i < sensorObjects.length; i++){
    for (var j = 0; j < sensorObjects[i].indices.length; j++){
      var ind = flatIndex($sensorCells, sensorObjects[i].indices[j][0], sensorObjects[i].indices[j][1]);
      $($sensorCells).index(ind).css('background-color', 'tomato');
    }
  }
}*/

