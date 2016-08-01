/*
Item tracking pseudocode:

1. Maintain a steady-state reading by averaging over previous cycles

2. Diff new reading with avg, if new reading < THRESHOLD, Update average by 
avg = (avg + newVal) * (n)/(n-1)

3. Else, if reading >= threshold, begin tracking new steady-state for x cycles

4. After x cycles, diff original state with new state to obtain readings specific to object

*/

import _ from 'lodash';
import Heap from 'heap';
import {sensorDims as sd} from './sensorDims';

const sensorDims = [sd.height, sd.width];

function timeQueue(){
  return new Heap((a,b) =>{
    a.timeStamp - b.timeStamp;
  });
} 

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

function heapRange(max){
  var h = new Heap()
  _.forEach(_.range(max), d => h.push(d))
  return h;
}

class LogObject{
  static sqEuDist(xy1, xy2){
    return Math.pow(xy1[0] - xy2[0], 2) + Math.pow(xy1[1] - xy2[1], 2);
  }

  constructor(reading, index){
    this.reading = reading,
    this.index = index;
    this.timeStamp = new Date();
  }

  centerOfMass(){
    if (this.cm)
      return this.cm;

    var coordAcc = [0,0];
    for (var i = 0; i < this.reading.readings.length; i++){
      for (var j = 0; j < this.reading.readings[i].length; j++){
        coordAcc[0] += this.reading.readings[i][j] * (i + .5);
        coordAcc[1] += this.reading.readings[i][j] * (j + .5);
      }
    }

    this.cm = coordAcc.map(d => d / this.reading.weight);
    return this.cm;
  }

  spread(){
    if (this.sp)
      return this.sp;
    var cm = this.centerOfMass();
    var spread = 0;
    for (var i = 0; i < this.reading.readings.length; i++){
      for (var j = 0; j < this.reading.readings[i].length; j++){
        spread += this.reading.readings[i][j] * LogObject.sqEuDist([i +.5 , j + .5], cm)
      }
    }
    spread /= this.reading.weight;
    this.sp = spread;
    return this.sp;
  }
}

var errorCount = 0;
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
      	try{
        	sum += this.readings[i][j];
        	max = this.readings[i][j] > max ? this.readings[i][j] : max;
      	}
      	catch (e){
      		console.error("wtf error", e, this);
      		console.log("counts", errorCount);
      		errorCount++;
      	}
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
  constructor(maxObjects){
    this.newObjectThreshold = 20,
    this.similarObjectThreshold = 20,
    this.readingCount = 0,
    this.avgReading = SensorReading.createNewReading(),
    this.testCycle = undefined,

    this.objects = new Set(),
    this.availableIndices = heapRange(maxObjects);

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
  
  // updateThresholds(){
  //   var newThreshold = _.sum(Array.from(this.objects).map(x => x.reading.weight)) * .15;
  //   this.newObjectThreshold = newThreshold;
  //   this.similarObjectThreshold = newThreshold;
  // }

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
      var newObject = new LogObject(diffResult, this.availableIndices.pop());
     this.addObject(newObject)
    }

    else if (diffMagnitude < -this.similarObjectThreshold){
      this.testDeleteObject(diffResult);
    }

    console.log(this.objects);
  }

  addObject(newObject){
    this.objects.add(newObject);
    // console.log("new object!", diffResult);
  }

  testDeleteObject(diffResult){
    var objectsArray = Array.from(this.objects);
    var objectDiffs = objectsArray.map(x => x.reading.reduceDiffReadings(diffResult, true));
    var bestObjectInd = indOfMin(objectDiffs);
    
    console.log("best object score", objectDiffs[bestObjectInd]);
    
    if (objectDiffs[bestObjectInd] <= this.newObjectThreshold)
      this.deleteObject(objectsArray[bestObjectInd]);
  }

  deleteObject(toDelete){
    this.objects.delete(toDelete);
    this.availableIndices.push(toDelete.index);
    // console.log("object removed!", objectsArray[bestObjectInd]);
  }

}

export{SensorReading,ObjectLogger};
