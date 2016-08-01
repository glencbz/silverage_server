import 'bulma';
import itemList from '../scss/itemList.scss';
import React from 'react';

const staticDir = '/static/placeholders/';
const placeholderImgs = ['banana.jpg', 'bread.jpg', 'ketchup.jpg'];
const placeholderTitles = ['Banana', 'Bread', 'Suspicious-looking chocolate', 'Unidentified vegetable', "Something you forgot about"];
const expiryColors = ['#ff6347', '#ffad33', '#4caf50']

function randRange(min, max){
	return min + Math.floor(Math.random() * max)
}

function randPlaceholderImg(){
	return 'url(' + staticDir + placeholderImgs[randRange(0, placeholderImgs.length)] + ')';
}

function randPlaceholderTitle(){
	return placeholderTitles[randRange(0, placeholderTitles.length)];
}

function randExpiry(){
	return randRange(0, expiryColors.length);
}

class ItemRow extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ItemRow';
        this.image = randPlaceholderImg();
        this.title = randPlaceholderTitle()
    }

    thumbStyles(){
    	return {
    		backgroundImage: this.image
    	};
    }

    render() {
        return (
        	<li className={itemList.itemRow + ' card'}>
        		<div className='media'>
        			<figure className='media-left'>
				      <div className={itemList.itemThumb} style={this.thumbStyles()}/>
        			</figure>
					<div className='media-content'>
						<div className='content'>
	        				<h2 className={itemList.itemTitle}>{this.title}</h2>
        				</div>
					</div>
					<div className='media-right'>
						<ItemInfo/>
					</div> 			
        		</div>
        	</li>
        );
    }
}

class ItemInfo extends React.Component {
	constructor(props) {
        super(props);
        this.displayName = 'ItemInfo';
        this.expiry = randExpiry();
    }

	render(){
		let styles = {
			backgroundColor: expiryColors[this.expiry]
		};

		return (
		<div className={itemList.itemInfo}>
			<div className={itemList.expiryDate} style={styles}>
				<div className='expiry-number'>{this.expiry + 1}</div>
				<div>days</div>
			</div>
		</div>);
	}
}

class ItemList extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ItemList';
    }
    render() {
    	var rows = [];
    	for (var i = 0; i < 5; i++)
    		rows.push(<ItemRow/>);
        return (
        <div>
        	<ul className={itemList.itemList}>{rows}</ul>
        		<ul className={itemList.catBtns}>
        			<li id="other-btn" className={itemList.catBtn}>All</li>
        			<li id="veg-btn" className={itemList.catBtn}>Veggies</li>
        			<li id="meat-btn" className={itemList.catBtn}>Meat</li>
        			<li id="meds-btn" className={itemList.catBtn}>Medicine</li>
        			<li id="dairy-btn" className={itemList.catBtn}>Dairy</li>
        			<li id="other-btn" className={itemList.catBtn}>Others</li>
        		</ul>
        </div>);
    }
}

export default ItemList;
