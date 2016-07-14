import _ from 'lodash';
import colors from 'colors';
import React from 'react';
import {SensorReading, ObjectLogger} from './itemTracker';

function sumPairwise(a1, a2){
  return _.forEach(a1, i => a1[i] + a2[i])
}

function rgbFromArray(colArray){
  return "rgb(" + colArray.join() + ")";
}

// expects Objects and index as props
class SensorCell extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'SensorCell';
  }

  getComponentColor(objectIndex){
    var object = this.props.objects[objectIndex];
    var proportion = object.readings[this.props.indices[0]][this.props.indices[1]] / object.weight;
    return color[objectIndex].map(d=>d * proportion);
  }

  getReadingColor(){
    var reading = this.props.readings[this.props.indices[0]][this.props.indices[1]];
    if (reading == 0)
      return [255,255,255];
    return [255 - reading, 0, 0];
  }

  render() {
    var componentColors = _.concat(_.forEach(this.props.objects, this.getComponentColor),
                           this.getReadingColor);
    var backgroundColor = _.reduce(componentColors, sumPairwise).map(d => d / componentColors/length);
    return (<div className="sensor-cell" style={{
      backgroundColor: rgbFromArray(backgroundColor)
    }}></div>);
  }
}

// expects props height and width
class SensorGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.height,
      width: this.props.width,
      objectLog: new ObjectLogger(),
      readings: SensorReading.createNewReadingArray()
    }
    this.displayName = 'SensorGrid';
  }

  updateReading(newReading){
    this.setState({
      readings: newReading
    });
  }

  cellRow(rowIndex){
    return _.times(this.state.width, columnIndex => 
      <Sensorcell indices={[rowIndex, columnIndex]}
                  objects={Array.from(this.objectLog.objects)}
                  readings={this.state.readings}/>
    );
  }

  render() {
    return (
      <div className="sensor-grid">
        {_.times(this.state.height, i => this.cellRow(i))}
      </div>);
  }
}

export default SensorGrid;
