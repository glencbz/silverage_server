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

function indOfMin(array){
  var min = array[0];
  var indMin = 0;

  for (var i = 1; i < array.length; i++)
    if (array[i] < min){
      min = array[i];
      indMin = i;
    }

  return indMin;
}

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
    [this.weight, this.max] = this.sumOverSelf();
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

  reduceDiffReadings(otherReading, add=false){
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
    var max = 0;
    for (var i = 0; i < sensorDims[0]; i ++)
      for (var j = 0; j < sensorDims[1]; j++){
        sum += this.readings[i][j];
        max = this.readings[i][j] > max ? this.readings[i][j] : max;
      }
    return [sum, max]; 
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
    // console.log('test reading', newReading);
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
    this.newObjectThreshold = 20,
    this.similarObjectThreshold = 20,
    this.readingCount = 0,
    this.avgReading = SensorReading.createNewReading(),
    this.testCycle = undefined,
    this.objects = new Set();
  }

  updateValues(newReading, callback){
    // if not currently testing for a new object
    if (!this.testCycle){
      // if the difference in readings is less than the threshold for a new object
      if (this.avgReading.reduceDiffReadings(newReading, false) < this.newObjectThreshold){
        this.readingCount += 1;
        this.avgReading = this.avgReading.averageNewReading(newReading, this.readingCount);
      }
      // if the difference in readings is not less than the threshold for a new object
      else{
        console.log('test start', this.avgReading, newReading);
        this.testCycle = new TestCycle(newReading);
      }
    }
    else{
      var testResult = this.testCycle.test(newReading);
      this.updateObjects(testResult);
    }
    callback(newReading, Array.from(this.objects));
  }
  
  updateObjects(testResult){
    if (!testResult)
      return undefined;

    console.log('test raw', testResult);
    var diffResult = testResult.diffReading(this.avgReading);
    console.log('test diff', diffResult);
    var diffMagnitude = diffResult.weight;

    this.testCycle = undefined;
    this.readingCount = 1;
    this.avgReading = testResult;

    if (diffMagnitude > this.newObjectThreshold){
      this.objects.add(diffResult);
      console.log("new object!", diffResult);
    }

    else if (diffMagnitude < -this.similarObjectThreshold){
      var objectsArray = Array.from(this.objects);
      var objectDiffs = objectsArray.map(x => x.reduceDiffReadings(diffResult, true));
      var bestObjectInd = indOfMin(objectDiffs);
      debugger;
      console.log("best object score", objectDiffs[bestObjectInd]);
      if (objectDiffs[bestObjectInd] <= this.newObjectThreshold){
        this.objects.delete(objectsArray[bestObjectInd]);
        console.log("object removed!", objectsArray[bestObjectInd]);
      }
    }

    console.log(this.objects);
  }
}

export{SensorReading,ObjectLogger};