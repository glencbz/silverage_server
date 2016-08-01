import React from "react";

class FootButton extends React.Component{
  render() {
    return (
      <div className='foot-btn'><i className={'fa '+ this.props.iconName}></i></div>
      );
  }
}

class MainListItem extends React.Component{
  constructor(){
    super();
    this.imgUrl = 'http://placehold.it/350x150?text=food';
  }

  render(){
    var style = {
      width: this.props.sideLength,
      height: this.props.sideLength,
      backgroundImage: `url${this.imgUrl}`
    };

    return (
          <li className="item" style={style}>
            <div className="item-name-container">
              <p className="item-name"> + itemTemplate + i +</p>
            </div>
          </li>
      );
  }
}

export default class SampleApp extends React.Component{
  constructor(){
    super();
    this.iconNames = ['fa-first-order',  'fa-play', 'fa-apple', 'fa-leaf','fa-cutlery'];
  }

  render() {
    var buttons = this.iconNames.map((name, i) => {
          return <FootButton iconName={name} key={i}/>
        });

    return (
    <div>
      <ul id="main-item-list">
        <MainListItem/>
      </ul>
      <footer>
        {buttons}
      </footer>
    </div>
    );
  }
}
