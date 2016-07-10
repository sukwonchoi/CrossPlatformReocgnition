import React, { Component } from 'react';
import { Point, PDollarRecognizer } from './PDollar.js'


import InkStore from '../stores/InkStore.js';

export default class RecognitionCanvas extends Component{

	constructor(){
		super();

		this.sketchpad_mouseDown = this.sketchpad_mouseDown.bind(this);
    this.sketchpad_mouseMove = this.sketchpad_mouseMove.bind(this);
    this.sketchpad_mouseUp = this.sketchpad_mouseUp.bind(this);
    this.sketchpad_touchStart = this.sketchpad_touchStart.bind(this);
    this.sketchpad_touchMove = this.sketchpad_touchMove.bind(this);
    this.sketchpad_touchEnd = this.sketchpad_touchEnd.bind(this);

    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);

	}

	undo(){

	}

	redo(){

	}

	x(){
		
	}

	sketchpad_mouseDown(){
		this.mouseX = e.pageX - this.canvas.offsetLeft;
    this.mouseY = e.pageY - this.canvas.offsetTop;
    this.paint = true;
    

    this.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    this.redraw();
	}
	sketchpad_mouseMove(){
    if(this.paint){
      this.addClick(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop, true);
      this.redraw();
    }	
	}
	sketchpad_mouseUp(){
    this.paint = false;

    this.timeoutHandler = setTimeout(this.addToBoard, 600);
    this.drawing = false;		
	}
	sketchpad_touchStart(){
		this.getTouchPos();
    this.paint = true;
    this.drawing = true;

    this.clickX.push(new Array());
    this.clickY.push(new Array());
    this.clickDrag.push(new Array());

    this.addClick(this.touchX, this.touchY, true);
    this.redraw();

    event.preventDefault();
	}
	sketchpad_touchMove(){
    this.getTouchPos();

    if(this.paint){
      this.addClick(this.touchX, this.touchY, true);
			this.redraw(); 
		}
		event.preventDefault();
	}
	sketchpad_touchEnd(){
		this.timeoutHandler = setTimeout(this.addToBoard, 600);
    this.drawing = false;		
	}

	render(){
		return(
			<canvas width={screen.width} height={screen.height - 80} ref="context" />
			);
	}

}