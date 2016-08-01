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

function perc(d){
   // return 100 - Math.round(d / 255 * 70)  + '%';
   return 100 - Math.round(d / 1000 * 70)  + '%';
}

function hslFromArray(colArray){
  return "hsla(" + [colArray[0], perc(colArray[1]), perc(colArray[2]), .7].join() + ")";
}

// expects Objects and index as props
class SensorCell extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'SensorCell';
    this.getReadingColor = this.getReadingColor.bind(this);
  }

  getReadingColor(){
    var reading = this.props.readings.readings[this.props.indices[0]][this.props.indices[1]];
    if (reading == 0)
      return [255,255,255];
    return [255 - Math.round(reading), 0, 0];
  }

  render() {
    var bgStyle = {
      backgroundColor: rgbFromArray(this.getReadingColor())
    };
    return (<div className="sensor-cell" style={bgStyle}></div>);
  }
}

class DisplayObject extends React.Component {
  constructor(props) {
    super(props);
    this.object = this.props.object;
    this.displayName = 'DisplayObject';
  }

  render(){
    var cm = this.object.centerOfMass();
    var coords = cm.map(d => d * 35 / 11 + 'em');
    var diam = (1 + this.object.spread() * 2) * 35 / 11;
    var style = {
      position: "absolute",
      top: "calc(" + coords[0] + " - " + (diam / 2) + "em)",
      left: "calc(" + coords[1] + " - " + (diam / 2) + "em)",
      width: diam + 'em',
      height: diam + 'em',
      borderRadius: diam + 'em',
      backgroundColor: hslFromArray([240, this.object.reading.weight, this.object.reading.weight]),
    }
    return (
      <div style={style}>
      </div>
    );
  }
}

// expects props height and width
class SensorGrid extends React.Component {
  constructor(props) {
    super(props);
    this.height = this.props.height;
    this.width = this.props.width;
    this.state = {
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
    return _.times(this.width, columnIndex => 
      <SensorCell indices={[rowIndex, columnIndex]}
                  readings={this.state.readings}/>
    );
  }

  render() {
    console.log('grid state', this.state);
    var displayObjects = this.state.objects.map((o,i) => <DisplayObject object={o} key={o.reading.weight + o.centerOfMass()}/>);
    return (
      <div className="sensor-grid">
        {displayObjects}
        {_.times(this.height, i => this.cellRow(i))}
      </div>);
  }
}

export default SensorGrid;
