/*
Item tracking pseudocode:

1. Maintain a steady-state reading by averaging over previous cycles

2. Diff new reading with avg, if new reading < THRESHOLD, Update average by 
avg = (avg + newVal) * (n)/(n-1)

3. Else, if reading >= threshold, begin tracking new steady-state for x cycles

4. After x cycles, diff original state with new state to obtain readings specific to object

*/

import _ from 'lodash';

const sensorDims = [5, 7];

class SensorReading{
  static createNewReading(){
    return new SensorReading(SensorReading.createNewReadingArray());
  }

  static createNewReadingArray(){
    return _.chunk(_.times(sensorDims[0] * sensorDims[1], _.constant(0)), sensorDims[1]);
  }
  constructor(readings){
    if (!readings)
      this.readings = SensorReading.createNewReadingArray();
    else
      this.readings = readings;
    this.weight = this.sumOverSelf();
  }  

  averageNewReading(newReading, timeStep){
    var denom = 1 / (timeStep + 1);
    var newAvg = SensorReading.createNewReadingArray();
    for (var i = 0; i < sensorDims[0]; i ++)
      for (var j = 0; j < sensorDims[1]; j++)
        newAvg[i][j] = denom * (newReading.readings[i][j] + timeStep * this.readings[i][j]);
    return new SensorReading(newAvg);
  }

  diffReading(otherReading){
    var diff = SensorReading.createNewReadingArray();
    for (var i = 0; i < sensorDims[0]; i ++)
      for (var j = 0; j < sensorDims[1]; j++)
        diff[i][j] = this.readings[i][j] - otherReading.readings[i][j];
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
        sum += Math.abs(op(otherReading.readings[i][j], this.readings[i][j]));
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
    this.numTestCycles = 5;
  }

  test(newReading){
    // if we are not done testing for an object
    if (this.testingCount < this.numTestCycles){
      this.testingAvg = this.testingAvg.averageNewReading(newReading, this.testingCount);
      this.testingCount += 1;
      return undefined;
    }
    else
      return this.testingAvg;
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
      var newAvg = this.avgReading.averageNewReading(newReading, this.readingCount);
      // if the difference in readings is less than the threshold for a new object
      if (this.avgReading.reduceDiffReadings(newAvg, true) < this.newObjectThreshold){
        this.readingCount += 1;
        this.avgReading = newAvg;
      }
      // if the difference in readings is not less than the threshold for a new object
      else
        this.testCycle = new TestCycle(newReading);
    }
    else{
      var testResult = this.testCycle.test(newReading);
      this.updateObjects(testResult);
    }
  }
  
  updateObjects(testResult){
    if (!testResult)
      return undefined;

    var testMagnitude = testResult.diffReading(this.avgReading).weight();

    this.testCycle = undefined;
    this.readingCount = 1;
    this.avgReading = testResult;

    if (testMagnitude > this.newObjectThreshold){
      this.objects.add(testResult);
      console.log("new object!", testResult);
    }
    else if (testMagnitude < -this.newObjectThreshold){
      var closestObject = _.minBy(Array.from(this.objects), x => x.reduceDiffReadings(testResult, false));
      this.objects.delete(closestObject);
      console.log("object removed!", closestObject);
    }
    console.log(this.objects);
  }
}

export{SensorReading,ObjectLogger};

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

