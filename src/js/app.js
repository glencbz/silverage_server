require('bootstrap-loader');
require('../scss/globals/main.scss');
import React from 'react'
import ReactDOM from 'react-dom';
import ItemList from './itemList.jsx';
import pullObjects from './pullObjects';

let targetItemList = document.getElementById("item-list");


var domItemList = ReactDOM.render(<ItemList/>, targetItemList);

setInterval(()=>{
	pullObjects(domItemList.updateObjects.bind(domItemList));
}, 1000);