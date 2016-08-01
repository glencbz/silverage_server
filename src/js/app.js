require('bootstrap-loader');
require('../scss/globals/main.scss');
import React from 'react'
import ReactDOM from 'react-dom';

import ItemList from './itemList.jsx';

let targetItemList = document.getElementById("item-list");
ReactDOM.render(<ItemList/>, targetItemList);

// require('../styles.css');
// require('normalize.css');
// require('font-awesome-webpack');


// import SampleApp from './SampleApp.jsx';

// const app = document.getElementById('app');
// ReactDOM.render(<SampleApp/>, app);