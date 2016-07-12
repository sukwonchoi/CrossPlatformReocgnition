import React, { Component } from 'react';
import { Point, PDollarRecognizer } from './PDollar.js'


import InkStore from '../stores/InkStore.js';

export default class RecognitionCanvas extends Component{

	constructor(){
		super();

		//Recognizer
		this.$P = new PDollarRecognizer();

		this.sketchpad_mouseDown = this.sketchpad_mouseDown.bind(this);
    this.sketchpad_mouseMove = this.sketchpad_mouseMove.bind(this);
    this.sketchpad_mouseUp = this.sketchpad_mouseUp.bind(this);
    this.sketchpad_touchStart = this.sketchpad_touchStart.bind(this);
    this.sketchpad_touchMove = this.sketchpad_touchMove.bind(this);
    this.sketchpad_touchEnd = this.sketchpad_touchEnd.bind(this);

		this.clickX = new Array();
		this.clickY = new Array();
		this.clickDrag = new Array();
		this.pointArray = new Array();

    this.addClick = this.addClick.bind(this);
    this.redraw = this.redraw.bind(this);

		this.undo = this.undo.bind(this);
		this.redo = this.redo.bind(this);

		this.recognize = this.recognize.bind(this);
		this.addGesture = this.addGesture.bind(this);
		this.deleteGesture = this.deleteGesture.bind(this);

		console.log("WTF");
	}

	componentDidMount(){
		this.canvas = this.refs.canvas;
		window.canvas = this.canvas;
		this.context = this.canvas.getContext('2d');

		this.canvas.addEventListener('mousedown', this.sketchpad_mouseDown, false);
		this.canvas.addEventListener('mousemove', this.sketchpad_mouseMove, false);
    this.canvas.addEventListener('mouseup', this.sketchpad_mouseUp, false);

    this.canvas.addEventListener('touchstart', this.sketchpad_touchStart, false);
    this.canvas.addEventListener('touchend', this.sketchpad_touchEnd, false);
    this.canvas.addEventListener('touchmove', this.sketchpad_touchMove, false);
	}

	//recognize, add, remove
	//clear canvas, redo, undo
	//


	recognize(points){
		return $P.Recognize(points);
	}
	addGesture(name, points){
		$P.AddGesture(name, points);
	}
	deleteGesture(){

	}

	undo(){
		console.log("UNDOOO ");
	}
	redo(){

	}

	clearCanvas(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.clickX.length = 0;
    this.clickY.length = 0;
    this.pointArray.length = 0;
    this.moveCount = 0;
	}

	setColor(color){
		this.color = color;
	}

	addClick(x, y, dragging)
  {
		var currentStroke = this.clickX.length - 1;
		
		this.clickX[currentStroke].push(x);
		this.clickY[currentStroke].push(y);

		if(!isNaN(x) && !isNaN(y)){
				var point = new Point(x, y, 2);
				this.pointArray.push(point);
		}

		this.clickDrag[currentStroke].push(dragging);
  }

	redraw(){
		this.ctx.strokeStyle = this.color;
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 5;

    var currentStroke = this.clickX.length - 1;
    var currentDot = this.clickX[currentStroke].length - 1;

    this.ctx.beginPath();
		if(this.clickDrag[currentStroke][currentDot] && currentDot){
			this.ctx.moveTo(this.clickX[currentStroke][currentDot-1], this.clickY[currentStroke][currentDot-1]);
		}else{
			this.ctx.moveTo(this.clickX[currentStroke][currentDot]-1, this.clickY[currentStroke][currentDot]);
		}
		this.ctx.lineTo(this.clickX[currentStroke][currentDot], this.clickY[currentStroke][currentDot]);

		this.ctx.closePath();
		this.ctx.stroke();
	}


	componentDidMount(){
 	}

	sketchpad_mouseDown(e){
		this.mouseX = e.pageX - this.canvas.offsetLeft;
    this.mouseY = e.pageY - this.canvas.offsetTop;
    this.paint = true;
    
    console.log("FUCK U");

    this.clickX.push(new Array());
    this.clickY.push(new Array());
		this.clickDrag.push(new Array());

    this.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    this.redraw();
	}
	sketchpad_mouseMove(e){
    if(this.paint){
			this.addClick(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop, true);
			this.redraw();
    }
	}
	sketchpad_mouseUp(e){
    this.paint = false;
	}
	sketchpad_touchStart(e){
		this.getTouchPos();
    this.paint = true;

    this.clickX.push(new Array());
    this.clickY.push(new Array());
    this.clickDrag.push(new Array());

    this.addClick(this.touchX, this.touchY, true);
    this.redraw();

    e.preventDefault();
	}
	sketchpad_touchMove(e){
    this.getTouchPos();

    if(this.paint){
      this.addClick(this.touchX, this.touchY, true);
			this.redraw();
		}
		e.preventDefault();
	}
	sketchpad_touchEnd(e){
		this.timeoutHandler = setTimeout(this.addToBoard, 600);
	}

	getTouchPos(e){
		if(!e)
			var e = event;
		if(e.touches){
			var touch = e.touches[0];
			this.touchX=touch.pageX-touch.target.offsetLeft;
			this.touchY=touch.pageY-touch.target.offsetTop;
		}
	}

	render(){
		return(
			<canvas width={screen.width} height={screen.height - 80} ref="canvas" />
			);
	}

}