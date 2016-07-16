import _ from 'lodash';
import React from 'react';
import colors from './colors';
import {SensorReading, ObjectLogger} from './itemTracker';

function sumPairwise(a1, a2){
  return _.map(a1, (_, i) => a1[i] + a2[i]);
}

function rgbFromArray(colArray){
  return "rgb(" + colArray.join() + ")";
}

// expects Objects and index as props
class SensorCell extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'SensorCell';
    this.getComponentColor = this.getComponentColor.bind(this);
    this.getReadingColor = this.getReadingColor.bind(this);
  }

  getComponentColor(object){
    var proportion = object.reading.readings[this.props.indices[0]][this.props.indices[1]] / object.reading.max;
    return colors[object.index].map(d=>d * proportion);
  }

  getReadingColor(){
    var reading = this.props.readings.readings[this.props.indices[0]][this.props.indices[1]];
    if (reading == 0)
      return [0,200,0];
    return [255 - reading, 0, 0];
  }

  render() {
    var componentColors = this.props.objects.map(d => this.getComponentColor(d));
    componentColors = _.filter(componentColors, (d)=> !_.isEqual(d,[0,0,0]));
    if (componentColors.length > 0)
      var backgroundColor = _.reduce(componentColors, sumPairwise).map(d => d / componentColors.length);
    else
      var backgroundColor = [255,255,255];
    var bgStyle = {
      backgroundColor: rgbFromArray(backgroundColor.map(Math.round)),
      border: "1px solid " + rgbFromArray(this.getReadingColor())
    };
    return (<div className="sensor-cell" style={bgStyle}></div>);
  }
}

// expects props height and width
class SensorGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: this.props.height,
      width: this.props.width,
      objects: [],
      readings: SensorReading.createNewReading()
    }
    this.displayName = 'SensorGrid';
  }

  updateReading(readings, objects){
    this.setState({
      readings, objects
    });
  }

  cellRow(rowIndex){
    return _.times(this.state.width, columnIndex => 
      <SensorCell indices={[rowIndex, columnIndex]}
                  objects={this.state.objects}
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
