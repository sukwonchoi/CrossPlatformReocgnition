import React, { Component } from 'react';
import { Point, PDollarRecognizer } from './PDollar.js'
import $ from 'jquery';

export default class Graphic extends Component{

  constructor(props){
    super(props);
    this.mouseDown = 0;
    this.clickX = new Array();
    this.clickY = new Array();
    this.clickDrag = new Array();
    this.pointArray = new Array();

    window.pdollar = new PDollarRecognizer();
    window.pointArray = this.pointArray;
    window.clickX = this.clickX;
    window.clickY = this.clickY;
    // window.recognize = 
  }

  componentDidMount(){
    this.canvas = this.refs.context;
    this.ctx = this.canvas.getContext('2d');

    this.sketchpad_mouseDown = this.sketchpad_mouseDown.bind(this);
    this.sketchpad_mouseMove = this.sketchpad_mouseMove.bind(this);
    this.sketchpad_mouseUp = this.sketchpad_mouseUp.bind(this);
    this.sketchpad_touchStart = this.sketchpad_touchStart.bind(this);
    this.sketchpad_touchMove = this.sketchpad_touchMove.bind(this);
    this.sketchpad_touchEnd = this.sketchpad_touchEnd.bind(this);

    this.clearCanvas = this.clearCanvas.bind(this);
    this.getMousePos = this.getMousePos.bind(this);
    this.getTouchPos = this.getTouchPos.bind(this);
    this.addClick = this.addClick.bind(this);
    this.redraw = this.redraw.bind(this);

    this.canvas.addEventListener('mousedown', this.sketchpad_mouseDown, false);
    this.canvas.addEventListener('mousemove', this.sketchpad_mouseMove, false);
    window.addEventListener('mouseup', this.sketchpad_mouseUp, false);

    this.canvas.addEventListener('touchstart', this.sketchpad_touchStart, false);
    this.canvas.addEventListener('touchend', this.sketchpad_touchEnd, false);
    this.canvas.addEventListener('touchmove', this.sketchpad_touchMove, false);
  }

  clearCanvas(){
    console.log(this.clickX + " " + this.clickY);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    alert(window.pdollar.Recognize(pointArray).Name);
    this.clickX.length = 0;
    this.clickY.length = 0;
    this.pointArray.length = 0;
  }
  redraw(){
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clears the canvas

    this.ctx.strokeStyle = "#df4b26";
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 5;

    var i = this.clickX.length - 1;
    this.ctx.beginPath();
    if(this.clickDrag[i] && i){
      this.ctx.moveTo(this.clickX[i-1], this.clickY[i-1]);
    }else{
      this.ctx.moveTo(this.clickX[i]-1, this.clickY[i]);
    }
    this.ctx.lineTo(this.clickX[i], this.clickY[i]);
    this.ctx.closePath();
    this.ctx.stroke();

    // for(var i=0; i < this.clickX.length; i++) {    
    //   this.ctx.beginPath();
    //   if(this.clickDrag[i] && i){
    //     this.ctx.moveTo(this.clickX[i-1], this.clickY[i-1]);
    //   }else{
    //     this.ctx.moveTo(this.clickX[i]-1, this.clickY[i]);
    //   }
    //   this.ctx.lineTo(this.clickX[i], this.clickY[i]);
    //   this.ctx.closePath();
    //   this.ctx.stroke();
    // }
  }

  // Keep track of the mouse button being pressed and draw a dot at current location
  sketchpad_mouseDown(e) {
    // this.mouseDown=1;
    // this.drawDot(this.ctx,this.mouseX,this.mouseY,12);
    this.mouseX = e.pageX - this.canvas.offsetLeft;
    this.mouseY = e.pageY - this.canvas.offsetTop;

    this.paint = true;
    this.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    this.redraw();
  }

    // Keep track of the mouse button being released
  sketchpad_mouseUp() {
    this.paint = false;
  }

    // Keep track of the mouse position and draw a dot if mouse button is currently pressed
  sketchpad_mouseMove(e) { 
    // Update the mouse co-ordinates when moved
    // this.getMousePos(e);

    // // Draw a dot if the mouse button is currently being pressed
    // if (this.mouseDown==1) {
    //     this.drawDot(this.ctx,this.mouseX,this.mouseY,12);
    // }
    if(this.paint){
      this.addClick(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop, true);
      this.redraw();
    }
  }

  getMousePos(e) {
      if (!e)
          var e = event;

      if (e.offsetX) {
          this.mouseX = e.offsetX;
          this.mouseY = e.offsetY;
      }
      else if (e.layerX) {
          this.mouseX = e.layerX;
          this.mouseY = e.layerY;
      }
   }

  // Draw something when a touch start is detected
  sketchpad_touchStart() {
      // // Update the touch co-ordinates
      // this.getTouchPos();

      // this.drawDot(this.ctx,this.touchX,this.touchY,12);

      // // Prevents an additional mousedown event being triggered
      // event.preventDefault();

    // this.mouseX = e.pageX - this.canvas.offsetLeft;
    // this.mouseY = e.pageY - this.canvas.offsetTop;

    this.getTouchPos();
    this.paint = true;
    this.addClick(this.touchX, this.touchY, true);
    this.redraw();

    event.preventDefault();
  }
  sketchpad_touchEnd() {
    this.paint = false;
  }
  // Draw something and prevent the default scrolling when touch movement is detected
  sketchpad_touchMove(e) { 
      // Update the touch co-ordinates
      // this.getTouchPos(e);

      // console.log("touch move");
      // // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
      // this.drawDot(this.ctx,this.touchX,this.touchY,12); 

      // // Prevent a scrolling action as a result of this touchmove triggering.
      // event.preventDefault();
      this.getTouchPos();

      if(this.paint){
        this.addClick(this.touchX, this.touchY, true);
        this.redraw(); 
      }
    if(this.paint){
    }

    event.preventDefault();
  }

  addClick(x, y, dragging)
  {
    this.clickX.push(x);
    this.clickY.push(y);
    if(!isNaN(x) && !isNaN(y)){
      var point = new Point(x, y, 2);
      this.pointArray.push(point);
    }
    this.clickDrag.push(dragging);
  }


  // Get the touch position relative to the top-left of the canvas
  // When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
  // but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
  // "target.offsetTop" to get the correct values in relation to the top left of the canvas.
  getTouchPos(e) {
    if (!e)
        var e = event;

    if(e.touches) {
      if (e.touches.length == 1) { // Only deal with one finger
        var touch = e.touches[0]; // Get the information for finger #1
        this.touchX=touch.pageX-touch.target.offsetLeft;
        this.touchY=touch.pageY-touch.target.offsetTop;
      }
    }
  }


  render(){
    return (
      <div>
        <canvas width={screen.width} height={screen.height - 50} ref="context" />
        <input type="submit" onClick={this.clearCanvas} value="Clear Sketchpad" id="clearbutton"  />
      </div>
      );
  }
}

