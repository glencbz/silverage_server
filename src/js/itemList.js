import React from 'react';

class ItemList extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'ItemList';
	}

	render() {
		return (
  			<ul className={itemList}>

  			</ul>
    	);
    }
}

class ItemRow extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'ItemRow';
		this.weight = this.props.weight;
		this.location = this.props.location
	}

	render() {
		return (
      	<li className={itemList.itemRow + ' card'}>
      		<div className='media'>
						<div className='media-content'>
							<div className='content'>
	      				<h2 className={itemList.itemTitle}>{this.weight}</h2>
	    				</div>
						</div>
						<div className='media-right'>
							<div className='delete-button' onClick={this.props.deleteObject}></div>
						</div> 			
      		</div>
      	</li>
    	);
    }
}

export default ItemList;
