import React, { Component } from 'react';
 

import Graphic from './Graphic.jsx';
import Sketchpad from './Sketchpad.jsx';
import Task from './Task.jsx';

 
// App component - represents the whole app
export default class App extends Component {
  
  constructor(){
    super();
    this.state = { rotation: 0 };
    this.tick = this.tick.bind(this);
  }

  componentDidMount(){
    requestAnimationFrame(this.tick);
  }

  tick(){
    this.setState({ rotation: this.state.rotation + .01 });
    requestAnimationFrame(this.tick());
  }


  render(){
    return (
      <Sketchpad />
    );
  }
}
