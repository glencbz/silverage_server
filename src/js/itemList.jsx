import 'bulma';
import itemList from '../scss/itemList.scss';
import React from 'react';
import _ from 'lodash';

const staticDir = '/static/placeholders/';
const expiryColors = ['#ff6347', '#ffad33', '#4caf50']

function randPlaceholderImg(){
	return 'url(' + staticDir + placeholderImgs[randRange(0, placeholderImgs.length)] + ')';
}

class ItemRow extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ItemRow';
    }

    imageUrl(){
      return 'url(img/' + this.props.image + ')';
    }
    thumbStyles(){
    	return {
        backgroundColor: 'gray',
    		backgroundImage: this.imageUrl()
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
	        				<h2 className={itemList.itemTitle}>{this.props.type}</h2>
        				</div>
					</div>
					<div className='media-right'>
						<ItemInfo expiryDate={this.props.expiryDate}/>
					</div> 			
        		</div>
        	</li>
        );
    }
}

class ItemInfo extends React.Component {

    static milsToDays(mils){
        return mils / (3600 * 1000 * 24);
    }

    static timeDiffDays(expiryDate){
        return _.round(ItemInfo.milsToDays(expiryDate - new Date()), 1);
    }

    static getExpiryColor(expiryDate){
        var remainTime = ItemInfo.timeDiffDays(expiryDate);
        if (remainTime < 2)
            return 0;
        else if (remainTime < 7)
            return 1;
        else
            return 2;
    }

	constructor(props) {
        super(props);
        this.displayName = 'ItemInfo';
    }

	render(){
		let styles = {
			backgroundColor: expiryColors[ItemInfo.getExpiryColor(this.props.expiryDate)]
		};

		return (
		<div className={itemList.itemInfo}>
			<div className={itemList.expiryDate} style={styles}>
				<div className='expiry-number'>{ItemInfo.timeDiffDays(this.props.expiryDate)}</div>
				<div>days</div>
			</div>
		</div>);
	}
}

class ItemList extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ItemList';
        this.state = {
            objects: []
        }
    }

    updateObjects(objects){
        this.setState({
            objects
        });
    }

    render() {
    	var rows = [];
    	for (var i = 0; i < this.state.objects.length; i++){
            var obj = this.state.objects[i];
        		rows.push(<ItemRow type={obj.type}
                                expiryDate={new Date(obj.expiryDate)}
                                image={obj.image}
                                key={obj.weight + obj.position}/>);
        }
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
