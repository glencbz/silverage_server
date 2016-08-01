import React from 'react';

function latestUrl(fileName){
	return 'url(' + fileName + '?' + new Date().getTime() + ')';
}

class ObjectList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			objects: []
		};
		this.displayName = 'ObjectList';
	}

	updateObjects(objects){
		this.setState({
			objects
		});
	}

	render() {
		var rows = this.state.objects.map((d) => <ObjectRow fileName={props.fileName} object={d} key={d.reading.weight + d.centerOfMass()}/>);
		return (
  			<ul>
  				{rows}
  			</ul>
    	);
    }
}

class ObjectRow extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'ObjectRow';
		this.location = this.props.location;
	}

	render() {
		return (
      	<li className='card'>
      		<div className='media'>
      			<figure className='media-left'>
      				<div className='objectThumb' style={{backgroundImage: latestUrl(props.fileName)}}/>
      			</figure>
				<div className='media-content'>
					<div className='content'>
  						<h3>{"Weight: " + this.props.object.reading.weight}</h3>
  						<p>{"Location: " + this.props.object.centerOfMass().join()}</p>
					</div>
				</div>
				<div className='media-right'>
					<div className='delete-button'/>
				</div> 			
      		</div>
      	</li>
    	);
    }
}

export {ObjectList};
