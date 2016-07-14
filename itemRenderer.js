import React from 'react';
import {SensorReading, ObjectLogger} from './itemTracker';

class SensorCell extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Sensorcell';
    this.readings = SensorReading.createNewReading();
  }
  render() {
    return <div>SensorGrid</div>;
  }
}

class SensorGrid extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'SensorGrid';
    this.readings = SensorReading.createNewReading();
  }
  render() {
    return <div>SensorGrid</div>;
  }
}

export default SensorGrid;
