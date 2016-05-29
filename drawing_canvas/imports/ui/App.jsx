import React, { Component } from 'react';
 

import Graphic from './Graphic.jsx';
import Sketchpad from './Sketchpad.jsx';
import Task from './Task.jsx';

 
// App component - represents the whole app
export default class App extends Component {
  
  constructor(){
    super();
  }

  componentDidMount(){
    requestAnimationFrame(this.tick);
  }

  tick(){
    requestAnimationFrame(this.tick());
  }


  render(){
    return (
      <Sketchpad />
    );
  }
}
