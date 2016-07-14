import React, { Component } from 'react';
import { Point, PDollarRecognizer } from './PDollar.js'
import { NDollarRecognizer } from './NDollar.js'

import InkStore from '../stores/InkStore.js';


export default class RecognitionCanvas extends Component{

	constructor(props){
		super(props);

		//Recognizers
		this.$P = new PDollarRecognizer();
		this.$N = new NDollarRecognizer(true);
		window.n = this.$N;
		
		//$P point array
		this.pointArray = new Array();

		//$N stroke array
		this.strokes = new Array();

		//Recognition algorithm
		this.recognitionAlgorithm = "";
		this.recognitionTime = 600;
		this.recognitionListener = null;

		this.sketchpad_mouseDown = this.sketchpad_mouseDown.bind(this);
		this.sketchpad_mouseMove = this.sketchpad_mouseMove.bind(this);
		this.sketchpad_mouseUp = this.sketchpad_mouseUp.bind(this);
		this.sketchpad_touchStart = this.sketchpad_touchStart.bind(this);
		this.sketchpad_touchMove = this.sketchpad_touchMove.bind(this);
		this.sketchpad_touchEnd = this.sketchpad_touchEnd.bind(this);

		this.clickX = new Array();
		this.clickY = new Array();

		window.clickX = this.clickX;
		window.strokes = this.strokes;

		this.addClick = this.addClick.bind(this);
		this.redraw = this.redraw.bind(this);

		this.undo = this.undo.bind(this);
		this.redo = this.redo.bind(this);

		this.recognize = this.recognize.bind(this);
		this.addGesture = this.addGesture.bind(this);
		this.deleteGesture = this.deleteGesture.bind(this);
		this.shapeDetected = this.shapeDetected.bind(this);
		this.setRecognitionAlgorithm = this.setRecognitionAlgorithm.bind(this);
		this.setRecognitionTime = this.setRecognitionTime.bind(this);
		this.setRecognitionListener = this.setRecognitionListener.bind(this);

	}

	componentWillMount(){
	}

	componentDidMount(){
		this.canvas = this.refs.canvas;
		this.context = this.canvas.getContext('2d');

		this.canvas.addEventListener('mousedown', this.sketchpad_mouseDown, false);
		this.canvas.addEventListener('mousemove', this.sketchpad_mouseMove, false);
		this.canvas.addEventListener('mouseup', this.sketchpad_mouseUp, false);

		this.canvas.addEventListener('touchstart', this.sketchpad_touchStart, false);
		this.canvas.addEventListener('touchend', this.sketchpad_touchEnd, false);
		this.canvas.addEventListener('touchmove', this.sketchpad_touchMove, false);
	}

	recognize(){
		if(this.recognitionAlgorithm == '$p')
			this.shapeDetected(this.$P.Recognize(this.pointArray).Name);
		else if(recognition == "$n")
			this.shapeDetected(this.$N.Recognize());
		// function(strokes, useBoundedRotationInvariance, requireSameNoOfStrokes, useProtractor)
	}
	
	setRecognitionAlgorithm(recognitionAlgorithm){
		this.recognitionAlgorithm = recognitionAlgorithm;
	}

	setRecognitionTime(time){
		this.recognitionTime = time;
	}

	setRecognitionListener(listener){
		this.recognitionListener = listener;
	}

	addGesture(name, points){
		$P.AddGesture(name, points);
	}

	deleteGesture(){

	}

	shapeDetected(shape){
		console.log(shape);
		this.recognitionListener(shape);
	}

	undo(){

	}
	
	redo(){

	}

	delete(numberOfStrokesAgo){

	}

	clearCanvas(){
	    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.clickX.length = 0;
	    this.clickY.length = 0;
	    this.strokes.length = 0;
	    this.pointArray.length = 0;
	    this.moveCount = 0;
	}

	setColor(color){	
		this.color = color;
	}

	addClick(x, y){
		// var currentStroke = this.clickX.length - 1;

		var currentStroke = this.strokes.length - 1;
		
		this.clickX[currentStroke].push(x);
		this.clickY[currentStroke].push(y);

		if(!isNaN(x) && !isNaN(y)){
			var point = new Point(x, y, currentStroke);
			this.strokes[currentStroke].push(point);
			this.pointArray.push(point);
		}
  }

	redraw(){
		this.context.strokeStyle = this.color;
		this.context.lineJoin = "round";
		this.context.lineWidth = 5;

		var currentStroke = this.clickX.length - 1;
		var currentDot = this.clickX[currentStroke].length - 1;

		// var currentStroke = this.strokes.length - 1;
		// var currentDot = this.strokes[currentStroke].length - 1;

		this.context.beginPath();
		
		/*if(currentDot){
			this.context.moveTo(this.strokes[currentStroke][currentDot-1].X, this.strokes[currentStroke][currentDot-1].Y);
		}else{
			this.context.moveTo(this.strokes[currentStroke][currentDot].X - 1, this.strokes[currentStroke][currentDot].Y)
		}
		this.context.lineTo(this.strokes[currentStroke][currentDot].X, this.strokes[currentStroke][currentDot].Y);
		*/
		
		if(currentDot){
			this.context.moveTo(this.clickX[currentStroke][currentDot-1], this.clickY[currentStroke][currentDot-1]);
		}else{
			this.context.moveTo(this.clickX[currentStroke][currentDot]-1, this.clickY[currentStroke][currentDot]);
		}

		this.context.lineTo(this.clickX[currentStroke][currentDot], this.clickY[currentStroke][currentDot]);

		this.context.closePath();
		this.context.stroke();
	}

	sketchpad_mouseDown(e){
		this.mouseX = e.pageX - this.canvas.offsetLeft;
		this.mouseY = e.pageY - this.canvas.offsetTop;
		this.paint = true;

		this.strokes.push(new Array());

		this.clickX.push(new Array());
		this.clickY.push(new Array());

		window.clickx = this.clickX
		window.clicky = this.clickY

		this.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		this.redraw();
	}

	sketchpad_mouseMove(e){
	    if(this.paint){
				this.addClick(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
				this.redraw();
	    }
	}

	sketchpad_mouseUp(e){
    	this.paint = false;
    	this.timeoutHandler = setTimeout(this.recognize, this.recognitionTime);
	}

	sketchpad_touchStart(e){
		this.getTouchPos();
    	this.paint = true;

    	this.clickX.push(new Array());
    	this.clickY.push(new Array());

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
		this.timeoutHandler = setTimeout(this.recognize, this.recognitionTime);
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