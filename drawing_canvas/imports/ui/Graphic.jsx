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
    this.color = "#df4b26";

    var initialseGestureList = new Array();
    initialseGestureList.push("X");
    initialseGestureList.push("O");

    this.state = {
      gestureList : initialseGestureList
    };
    
    this.sketchpad_mouseDown = this.sketchpad_mouseDown.bind(this);
    this.sketchpad_mouseMove = this.sketchpad_mouseMove.bind(this);
    this.sketchpad_mouseUp = this.sketchpad_mouseUp.bind(this);
    this.sketchpad_touchStart = this.sketchpad_touchStart.bind(this);
    this.sketchpad_touchMove = this.sketchpad_touchMove.bind(this);
    this.sketchpad_touchEnd = this.sketchpad_touchEnd.bind(this);

    this.clearCanvas = this.clearCanvas.bind(this);
    this.addGesture = this.addGesture.bind(this);
    this.deleteGesture = this.deleteGesture.bind(this);
    this.getMousePos = this.getMousePos.bind(this);
    this.getTouchPos = this.getTouchPos.bind(this);
    this.addClick = this.addClick.bind(this);
    this.redraw = this.redraw.bind(this);
    this.onColorChange = this.onColorChange.bind(this);

    window.pdollar = new PDollarRecognizer();
    window.pointArray = this.pointArray;
    window.clickX = this.clickX;
    window.clickY = this.clickY;

    window.deleteGesture = this.deleteGesture;
    window.state = this.state;
  }

  componentDidMount(){
    this.canvas = this.refs.context;
    window.canvas = this.canvas;
    this.ctx = this.canvas.getContext('2d');
    window.ctx = this.ctx;
    
    this.canvas.addEventListener('mousedown', this.sketchpad_mouseDown, false);
    this.canvas.addEventListener('mousemove', this.sketchpad_mouseMove, false);
    window.addEventListener('mouseup', this.sketchpad_mouseUp, false);

    this.canvas.addEventListener('touchstart', this.sketchpad_touchStart, false);
    this.canvas.addEventListener('touchend', this.sketchpad_touchEnd, false);
    this.canvas.addEventListener('touchmove', this.sketchpad_touchMove, false);
  }

  addGesture(e){
    e.preventDefault();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    var form = e.target;
    var gestureName = form.querySelector('[name="gesturename"]').value;
    
    let tempGestureList = this.state.gestureList;
    tempGestureList.push(gestureName);
    this.setState(
      {
        gestureList: tempGestureList
      }
    );

    window.pdollar.AddGesture(gestureName, pointArray);
  }

  deleteGesture(name){

    // e.preventDefault();
    var gestureName = name;
    // var gestureName = "asdf";
    let tempGestureList = this.state.gestureList;

    var index = tempGestureList.indexOf(gestureName);

    if(index != -1)
        tempGestureList.splice( index, 1 );


    this.setState(
      {
        gestureList: tempGestureList
      }
    );

    window.pdollar.DeleteUserGestures();
  }

  clearCanvas(){
    console.log(this.clickX + " " + this.clickY);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    alert("Gesture: " + window.pdollar.Recognize(pointArray).Name + " Score: " + window.pdollar.Recognize(pointArray).Score);
    this.clickX.length = 0;
    this.clickY.length = 0;
    this.pointArray.length = 0;
  }

  redraw(){
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clears the canvas

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

  // Keep track of the mouse button being pressed and draw a dot at current location
  sketchpad_mouseDown(e) {
    this.mouseX = e.pageX - this.canvas.offsetLeft;
    this.mouseY = e.pageY - this.canvas.offsetTop;

    this.paint = true;
    this.clickX.push(new Array());
    this.clickY.push(new Array());
    this.clickDrag.push(new Array());    
    this.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    this.redraw();
  }

    // Keep track of the mouse button being released
  sketchpad_mouseUp() {
    this.paint = false;
  }

    // Keep track of the mouse position and draw a dot if mouse button is currently pressed
  sketchpad_mouseMove(e) { 
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
    this.getTouchPos();
    this.paint = true;

    this.clickX.push(new Array());
    this.clickY.push(new Array());
    this.clickDrag.push(new Array());
    this.addClick(this.touchX, this.touchY, true);
    this.redraw();

    event.preventDefault();
  }
  sketchpad_touchEnd() {
    this.paint = false;
  }

  sketchpad_touchMove(e) { 
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
    var currentStroke = this.clickX.length - 1;

    this.clickX[currentStroke].push(x);
    this.clickY[currentStroke].push(y);
    if(!isNaN(x) && !isNaN(y)){
      var point = new Point(x, y, 2);
      this.pointArray.push(point);
    }
    this.clickDrag[currentStroke].push(dragging);
  }

  getTouchPos(e) {
    if (!e)
        var e = event;

    if(e.touches) {
      if (e.touches.length == 1) { // Only deal with one finger
        var touch = e.touches[0]; // Get the information for finger #1
        this.touchX=touch.pageX-touch.target.offsetLeft;
        this.touchY=touch.pageY-touch.target.offsetTop;
        //
        //<input type="text" id="gestureName" ref="gestureNameTextBox" placeholder="Gesture Name" />
      }
    }
  }

  onColorChange(e){
  		this.color = e.currentTarget.value;
  }

  render(){
    return (
      <div>
        <canvas width={screen.width} height={screen.height - 80} ref="context" />


        <input type="submit" onClick={this.clearCanvas} value="Clear Sketchpad" id="clearbutton"  />
        <form onSubmit={this.addGesture}>
          <input type="text" name="gesturename" id="gesturename"/>
          <input type="submit" value="Add Geture" id="addgesturebutton"  />
        </form>
        <form action="">
  			<input type="radio" name="color" value="#df4b26" onChange={this.onColorChange} defaultChecked={true}/> Red<br/>
  			<input type="radio" name="color" value="#0000FF" onChange={this.onColorChange}/> Blue<br/>
  			<input type="radio" name="color" value="#000000" onChange={this.onColorChange}/> Black
		</form>

        <ul>
            {
              this.state.gestureList.map(function(name){
                    return <li key ={name}>
                              {name}
                              <input type="submit" name={name} value="Delete" onClick={() => this.deleteGesture(name)} />
                            </li>;
                  })
            }
          </ul>
      </div>
      );
  }
}

class GestureList extends React.Component{





  render(){
    return(
      <ul>
          {this.props.gesture.map(function(name){
            return (
            <li key={name}>
              {name}
              <input type="submit" value="Delete" onClick={this.props.deleteGesture} />
            </li>
            );
          })
        }
      </ul>    
      );
  }

}

