import React, { Component } from 'react';
import { Point, Result, PDollarRecognizer } from './PDollar.js'
import { NDollarRecognizer } from './NDollar.js'
import { Beautifier } from './Beautifier.js'
import { Gesture } from './Gesture.js'

import InkStore from '../../stores/InkStore.js';


export default class RecognitionCanvas extends Component{

	constructor(props){
		super(props);

		//Recognizers
		this.$P = new PDollarRecognizer();
		this.$N = new NDollarRecognizer(false);
		this.beautifier = new Beautifier();

		//$P point array
		this.pointArray = new Array();

		//$N stroke array
		this.strokes = new Array();
		window.strokes = this.strokes;

		//For actual drawing
		this.drawingPoints = new Array();
		this.strokeCount = 0;

		//Recognition settings
		this.recognitionAlgorithm = props.recognitionAlgorithm;
		this.recognitionTime = props.recognitionTime;
		this.recognitionListener = props.recognitionListener;

		//Undo/Redo settings
		this.undoListener = props.undoListener;
		this.redoListener = props.redoListener;

		//Beautification settings
		this.doBeautification = props.beautification;

		//Timeout for stroke bundling into a single gesture
		this.timeoutHandler = null;

		//Drawing color
		this.color = props.color;

		//Method binding
		this.sketchpad_mouseDown = this.sketchpad_mouseDown.bind(this);
		this.sketchpad_mouseMove = this.sketchpad_mouseMove.bind(this);
		this.sketchpad_mouseUp = this.sketchpad_mouseUp.bind(this);
		this.sketchpad_touchStart = this.sketchpad_touchStart.bind(this);
		this.sketchpad_touchMove = this.sketchpad_touchMove.bind(this);
		this.sketchpad_touchEnd = this.sketchpad_touchEnd.bind(this);

		this.addClick = this.addClick.bind(this);
		this.redraw = this.redraw.bind(this);
		this.redrawAll = this.redrawAll.bind(this);

		this.undo = this.undo.bind(this);
		this.redo = this.redo.bind(this);

		this.recognize = this.recognize.bind(this);
		this.addGesture = this.addGesture.bind(this);
		this.shapeDetected = this.shapeDetected.bind(this);

		this.getXCentre = this.getXCentre.bind(this);
		this.getYCentre = this.getYCentre.bind(this);

		//Action booleans
		this.state = {
	      doUndo: props.undo,
	      doRedo: props.redo,
	      doClearCanvas: props.clearCanvas,
	    };
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

	componentWillReceiveProps(nextProps){
		
		console.log("Undo: " + nextProps.undo);
		console.log("Redo: " + nextProps.redo);
		console.log("Clear Canvas: " + nextProps.clearCanvas);

		if(nextProps.undo){
			this.undo();
		}
		else if(nextProps.redo){
			this.redo();
		}
		else if(nextProps.clearCanvas){
			this.clearCanvas();
		}
	}

	recognize(){
		var resultP = this.$P.Recognize(this.pointArray);
		var resultN = this.$N.Recognize(this.strokes);

		if(this.recognitionAlgorithm == '$p'){
			this.shapeDetected(resultP.Name, resultP.Score, this.getXCentre(), this.getYCentre());
		}
		else if(this.recognitionAlgorithm == "$n"){
			this.shapeDetected(resultN.Name, resultN.Score, this.getXCentre(), this.getYCentre());
		}
		else if(this.recognitionAlgorithm == "hybrid"){
			if(resultP.Score > resultN.Score)
				this.shapeDetected(resultP.Name, resultP.Score, this.getXCentre(), this.getYCentre());
			else
				this.shapeDetected(resultN.Name, resultN.Score, this.getXCentre(), this.getYCentre());
		}
	}

	disableBeautification(){
		this.disableBeautification = false;
	}

	addGesture(name){
		$P.AddGesture(name, this.pointArray);
		this.clearCanvas();
	}

	disableGesture(gesture){
		this.$P.DisableGesture(gesture);
	}

	enableGesture(gesture){
		this.$P.EnableGesture(gesture);
	}

	shapeDetected(shape, score, centreOfGestureX, centreOfGestureY){
		var newDrawingPoints = new Array();
		console.log(shape);
		while(this.strokeCount > 0)
		{
			newDrawingPoints.push(this.strokes[this.strokes.length - this.strokeCount]);
			this.strokeCount--;
		}
		var gesture = new Gesture(centreOfGestureX, centreOfGestureY, this.beautifier.Beautify(shape, newDrawingPoints), this.color, shape, score);
		this.drawingPoints.push(gesture);
		this.redrawAll();
		this.recognitionListener(gesture);
		this.pointArray.length = 0;
	}

	getXCentre(){
		var xCentre = 0;
		
		for(var x = 0; x < this.pointArray.length - 1; x++){
			xCentre += this.pointArray[x].X;
		}

		xCentre /= this.pointArray.length;

		return Math.round(xCentre);
	}

	getYCentre(){
		var yCentre = 0;

		for(var y = 0; y < this.pointArray.length - 1; y++){
			yCentre += this.pointArray[y].Y;
		}

		yCentre /= this.pointArray.length;

		return Math.round(yCentre);
	}

	undo(){
		this.undoStorage = this.drawingPoints.pop();
		this.undoListener(this.undoStorage);
		this.redrawAll();
	}
	
	redo(){
		this.drawingPoints.push(this.undoStorage);
		this.redoListener(this,undoStorage);
		this.redrawAll();
	}

	clearCanvas(){
	    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.strokes.length = 0;
	    this.pointArray.length = 0;
	    this.drawingPoints.length = 0;
	    this.moveCount = 0;
	    this.colorsForDrawing.length = 0;
	    this.undoStorage = null;
		this.undoColor = null;
	}

	setColor(color){	
		this.color = color;
	}

	addClick(x, y){
		var currentStroke = this.strokes.length - 1;

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

		var currentStroke = this.strokes.length - 1;
		var currentDot = this.strokes[currentStroke].length - 1;

		this.context.beginPath();
		
		if(currentDot > 1){
			this.context.moveTo(this.strokes[currentStroke][currentDot-1].X, this.strokes[currentStroke][currentDot-1].Y);
		}
		else if(currentDot == 0){
			this.context.moveTo(this.strokes[currentStroke][currentDot].X, this.strokes[currentStroke][currentDot].Y)
		}
		else{
			this.context.closePath();
			this.context.stroke();
			return;
		}
		this.context.lineTo(this.strokes[currentStroke][currentDot].X, this.strokes[currentStroke][currentDot].Y);
		this.context.closePath();
		this.context.stroke();
	}

	redrawAll(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.lineJoin = "round";
		this.context.lineWidth = 5;

		for(var i = 0; i < this.drawingPoints.length; i++){
			this.context.strokeStyle = this.drawingPoints[i].color;
			var gestureStrokes = this.drawingPoints[i].strokes;
			for(var j = 0; j < gestureStrokes.length; j++){
				var stroke = gestureStrokes[j];
				for(var k = 0; k < stroke.length; k++){
					this.context.beginPath();
					if(k > 0){
						this.context.moveTo(stroke[k-1].X, stroke[k-1].Y);
					}
					else if(k == 0){
						this.context.moveTo(stroke[k].X, stroke[k].Y)
					}
					else{
						this.context.closePath();
						this.context.stroke();
						continue;
					}
					this.context.lineTo(stroke[k].X, stroke[k].Y);
					this.context.closePath();
					this.context.stroke();
				}
			}
		}
	}

	sketchpad_mouseDown(e){
		this.mouseX = e.pageX - this.canvas.offsetLeft;
		this.mouseY = e.pageY - this.canvas.offsetTop;
		this.paint = true;
		this.strokes.push(new Array());
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
    	clearTimeout(this.timeoutHandler);
    	this.timeoutHandler = setTimeout(this.recognize, this.recognitionTime);
    	this.strokeCount++;
	}

	sketchpad_touchStart(e){
		this.getTouchPos();
		this.paint = true;
		this.strokes.push(new Array());
		this.addClick(this.touchX, this.touchY);
		this.redraw();
		e.preventDefault();
	}

	sketchpad_touchMove(e){
		this.getTouchPos();
		if(this.paint){
			this.addClick(this.touchX, this.touchY);
			this.redraw();
		}
		e.preventDefault();
	}

	sketchpad_touchEnd(e){
		clearTimeout(this.timeoutHandler);
		this.timeoutHandler = setTimeout(this.recognize, this.recognitionTime);
		this.strokeCount++;
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
			<canvas width={screen.width} height={screen.height - 120} ref="canvas" />
			);
	}

}