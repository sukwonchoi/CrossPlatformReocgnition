import React, { Component } from 'react';
import { Point, PDollarRecognizer } from './PDollar.js'


import InkStore from '../stores/InkStore.js';

export default class Graphic extends Component{

  constructor(props){
    super(props);
    this.mouseDown = 0;
    this.clickX = new Array();
    this.clickY = new Array();
    this.clickDrag = new Array();
    this.pointArray = new Array();

    this.boardLinesX = new Array();
    this.boardLinesY = new Array();

    this.widthOfDrawnBoard = 0;
    this.heightOfDrawnBoard = 0;
    this.minXOfDrawnBoard = 0;
    this.minYOfDrawnBoard = 0;
    this.moveCount = 0;
    this.lastGesture = "";

    this.boardDrawn = false;

    // this.board = new Array(9);
    this.board = [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"]];
    window.board = this.board;
    this.drawing = false;

    this.color = InkStore.getColour();
    console.log(InkStore.getColour());
    window.color = this.color;

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


    this.addToBoard = this.addToBoard.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.addGesture = this.addGesture.bind(this);
    this.deleteGesture = this.deleteGesture.bind(this);
    this.getMousePos = this.getMousePos.bind(this);
    this.getTouchPos = this.getTouchPos.bind(this);
    this.addClick = this.addClick.bind(this);
    this.redraw = this.redraw.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.getSquareNumber = this.getSquareNumber.bind(this);
    this.beautifyBoard = this.beautifyBoard.bind(this);
    this.drawBoardAndBeautifiedGestures = this.drawBoardAndBeautifiedGestures.bind(this);

    this.checkWinLogic = this.checkWinLogic.bind(this);

    this.pdollar = new PDollarRecognizer();
    window.pdollar = this.pdollar 
    window.pointArray = this.pointArray;
    window.clickX = this.clickX;
    window.clickY = this.clickY;

    window.deleteGesture = this.deleteGesture;
    window.state = this.state;
  }

  componentWillMount(){
    InkStore.on("change", () =>{
      this.setState({
        title: TitleStore.getColour(),
      });
    })
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

    this.ctx.canvas.width  = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
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

    this.pdollar.AddGesture(gestureName, pointArray);
  }

  deleteGesture(name){

    var gestureName = name;
    let tempGestureList = this.state.gestureList;

    var index = tempGestureList.indexOf(gestureName);

    if(index != -1)
        tempGestureList.splice( index, 1 );


    this.setState(
      {
        gestureList: tempGestureList
      }
    );

    this.pdollar.DeleteUserGestures();
  }

  addToBoard(){

    squareNumber = this.getSquareNumber(this.ctx);
    index = squareNumber - 1;

    n = 3;
    x = index % n;
    y = Math.floor(index / n);

    gesture = this.pdollar.Recognize(pointArray).Name;

    if(this.lastGesture == gesture){
      this.drawBoardAndBeautifiedGestures();
      this.clickX.length = 0;
      this.clickY.length = 0;
      this.pointArray.length = 0;
      alert("Not your turn!");
      return;
    }

    if(this.board[x][y] == "O" || this.board[x][y] == "X"){
      this.drawBoardAndBeautifiedGestures();
      alert("Please choose another slot!");
      return;
    }

    this.board[x][y] = gesture;  
    var won = this.checkWinLogic(x, y, gesture);

    this.drawBoardAndBeautifiedGestures();

    this.lastGesture = gesture;
    this.clickX.length = 0;
    this.clickY.length = 0;
    this.pointArray.length = 0;

    if(won){
      this.clearCanvas();
    }
    else{
      this.moveCount = this.moveCount + 1;
      if(this.moveCount == 9){
        alert("It's a tie!");
        this.clearCanvas();
      }
    }
  }

  drawBoardAndBeautifiedGestures(){
    xMin = this.minXOfDrawnBoard;
    yMin = this.minYOfDrawnBoard;

    context = this.ctx;
    
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.beginPath();

    let bw = this.widthOfDrawnBoard;
    let bh = this.heightOfDrawnBoard;

    let size = 3;

    let wi = bw / size;
    let hi = bh / size;

    context.moveTo(wi     + xMin, 0   + yMin);
    context.lineTo(wi     + xMin, bh  + yMin);
    context.moveTo(wi * 2 + xMin, 0   + yMin);
    context.lineTo(wi * 2 + xMin, bh  + yMin);

    context.moveTo(0  + xMin, hi      + yMin);
    context.lineTo(bw + xMin, hi      + yMin);
    context.moveTo(0  + xMin, hi * 2  + yMin);
    context.lineTo(bw + xMin, hi * 2  + yMin);

    context.closePath();
    context.strokeStyle = "black";
    context.stroke();    

    for(var x = 0; x < 3; x++){
      for(var y = 0; y < 3; y++){

        var centerX = xMin + (wi/2) + (wi * x);
        var centerY = yMin + (hi/2) + (hi * y);
        var radius = Math.min(wi, hi) / 3;
        context.beginPath();
        if(this.board[x][y] == "O"){
          context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        }
        else if(this.board[x][y] == "X"){
          context.moveTo(centerX - radius, centerY - radius);
          context.lineTo(centerX + radius, centerY + radius);
          context.moveTo(centerX + radius, centerY - radius);
          context.lineTo(centerX - radius, centerY + radius);
        }
        context.strokeStyle = this.color;
        context.lineJoin = "round";
        context.lineWidth = 5;
        context.closePath();
        context.stroke();
      }
    }

  }

  checkWinLogic(x, y, s){
  
    for(i = 0; i < n; i++){
      if(this.board[x][i] != s){
        break;
      }
      if(i == n-1){
        alert(s + " wins!");
        console.log(s + "wins!");
        return true;
      }
    }

    //check row
    for(i = 0; i < n; i++){
      if(this.board[i][y] != s){
        break;
      }
      if(i == n-1){
        alert(s + " wins!");
        console.log(s + "wins!");
        return true;
      }
    }

      //check diag
    if(x == y){
      //we're on a diagonal
      for(i = 0; i < n; i++){
        if(this.board[i][i] != s){
          break;
        }
        if(i == n-1){
          alert(s + " wins!");
          console.log(s + "wins!");
          return true;
        }
      }
    }

            //check anti diag (thanks rampion)
    for(i = 0;i<n;i++){
      if(this.board[i][(n-1)-i] != s){
        break;
      }
      if(i == n-1){

        alert(s + " wins!");
        console.log(s + "wins!");
        return true;
      }
    }

    return false;
  }

  clearCanvas(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.board = [["", "", ""], ["", "", ""], ["", "", ""]];
    this.lastGesture = "";
    this.clickX.length = 0;
    this.clickY.length = 0;
    this.pointArray.length = 0;
    this.boardDrawn = false;
    this.boardLinesX.length = 0;
    this.boardLinesY.length = 0;
    this.widthOfDrawnBoard = 0;
    this.heightOfDrawnBoard = 0;
    this.minXOfDrawnBoard = 0;
    this.minYOfDrawnBoard = 0;
    this.moveCount = 0;
  }

  getSquareNumber(context){

    let count = this.pointArray.length;

    var x = 0;
    var y = 0;

    for(var i = 0; i < count; i++){
      x += pointArray[i].X;
      y += pointArray[i].Y;  
    }

    x /= count;
    y /= count;

    console.log("X:" + x);
    console.log("Y:" + y);

    let width = this.widthOfDrawnBoard;
    let height = this.heightOfDrawnBoard;
    let xMin = this.minXOfDrawnBoard;
    let yMin = this.minYOfDrawnBoard;
    
    x = x - xMin;
    y = y - yMin;

    if( x < width/3 ){
        if(y < height/3){
          return 1;
        }
        else if( y < 2 * height/3){
          return 4;
        }
        else{
          return 7;
        }
    }
    else if ( x < 2 * width/3 ){
        if(y < height/3){
          return 2;
        }
        else if( y < 2 * height/3){
          return 5;
        }
        else{
          return 8;
        }
    }
    else{
        if(y < height/3){
          return 3;
        }
        else if( y < 2 * height/3){
          return 6;
        }
        else{ 
          return 9;
        }
    }
  }

  redraw(){
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clears the canvas

    this.ctx.strokeStyle = this.color;
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 5;

    if(this.boardDrawn){
      var currentStroke = this.clickX.length - 1;
      var currentDot = this.clickX[currentStroke].length - 1;

      this.ctx.beginPath();
      if(this.clickDrag[currentStroke][currentDot] && currentDot){
        this.ctx.moveTo(this.clickX[currentStroke][currentDot-1], this.clickY[currentStroke][currentDot-1]);
      }else{
        this.ctx.moveTo(this.clickX[currentStroke][currentDot]-1, this.clickY[currentStroke][currentDot]);
      }
      this.ctx.lineTo(this.clickX[currentStroke][currentDot], this.clickY[currentStroke][currentDot]);
    }
    else{
      var currentStroke = this.boardLinesX.length - 1;
      var currentDot = this.boardLinesX[currentStroke].length - 1;

      this.ctx.beginPath();
      this.ctx.moveTo(this.boardLinesX[currentStroke][currentDot-1], this.boardLinesY[currentStroke][currentDot-1]);
      this.ctx.lineTo(this.boardLinesX[currentStroke][currentDot], this.boardLinesY[currentStroke][currentDot]);
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }

  // Keep track of the mouse button being pressed and draw a dot at current location
  sketchpad_mouseDown(e) {
    this.mouseX = e.pageX - this.canvas.offsetLeft;
    this.mouseY = e.pageY - this.canvas.offsetTop;
    this.paint = true;
    
    if(this.boardDrawn){
      if(!this.drawing){
        this.drawing = true;
        clearTimeout(this.timeoutHandler);
      }
      this.drawing = true;
      this.clickX.push(new Array());
      this.clickY.push(new Array());
      this.clickDrag.push(new Array());
    }
    else{
      this.boardLinesX.push(new Array());
      this.boardLinesY.push(new Array());    
    }
    this.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    this.redraw();
  }

    // Keep track of the mouse button being released
  sketchpad_mouseUp() {
    this.paint = false;

    if(!this.boardDrawn){
      if(this.boardLinesX.length == 4){
        this.beautifyBoard();
        this.boardDrawn = true;
      }

      this.drawing = false;
      return;
    }

    this.timeoutHandler = setTimeout(this.addToBoard, 600);
    this.drawing = false;
  }

  beautifyBoard(){

    var xArray = this.boardLinesX[0].concat(this.boardLinesX[1], this.boardLinesX[2], this.boardLinesX[3]);
    var yArray = this.boardLinesY[0].concat(this.boardLinesY[1], this.boardLinesY[2], this.boardLinesY[3]);


    var xMax = Math.max.apply(Math, xArray);
    var xMin = Math.min.apply(Math, xArray);
    var yMax = Math.max.apply(Math, yArray);
    var yMin = Math.min.apply(Math, yArray);

    this.minXOfDrawnBoard = xMin;
    this.minYOfDrawnBoard = yMin;
    this.heightOfDrawnBoard = yMax - yMin;
    this.widthOfDrawnBoard = xMax - xMin;

    context = this.ctx;
    
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.beginPath();


    let bw = xMax - xMin;
    let bh = yMax - yMin;

    let size = 3;

    let wi = bw / size;
    let hi = bh / size;

    context.moveTo(wi     + xMin, 0   + yMin);
    context.lineTo(wi     + xMin, bh  + yMin);
    context.moveTo(wi * 2 + xMin, 0   + yMin);
    context.lineTo(wi * 2 + xMin, bh  + yMin);

    context.moveTo(0  + xMin, hi      + yMin);
    context.lineTo(bw + xMin, hi      + yMin);
    context.moveTo(0  + xMin, hi * 2  + yMin);
    context.lineTo(bw + xMin, hi * 2  + yMin);

    context.closePath();
    context.strokeStyle = "black";
    context.stroke();
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

    if(this.boardDrawn){
      if(!this.drawing){
        this.drawing = true;
        clearTimeout(this.timeoutHandler);
      }
      this.drawing = true;
      this.clickX.push(new Array());
      this.clickY.push(new Array());
      this.clickDrag.push(new Array());
    }
    else{
      this.boardLinesX.push(new Array());
      this.boardLinesY.push(new Array());    
    }

    this.addClick(this.touchX, this.touchY, true);
    this.redraw();

    event.preventDefault();
  }
  sketchpad_touchEnd() {
    if(!this.boardDrawn){
      if(this.boardLinesX.length == 4){
        this.beautifyBoard();
        this.boardDrawn = true;
      }

      this.drawing = false;
      return;    
    }

    this.timeoutHandler = setTimeout(this.addToBoard, 600);
    this.drawing = false;
  }

  sketchpad_touchMove(e) { 
    this.getTouchPos();

    if(this.paint){
      this.addClick(this.touchX, this.touchY, true);
      this.redraw(); 
    }

    event.preventDefault();
  }

  addClick(x, y, dragging)
  {
    if(this.boardDrawn){
      var currentStroke = this.clickX.length - 1;

      this.clickX[currentStroke].push(x);
      this.clickY[currentStroke].push(y);
      if(!isNaN(x) && !isNaN(y)){
        var point = new Point(x, y, 2);
        this.pointArray.push(point);
      }
      this.clickDrag[currentStroke].push(dragging);
    }
    else{
      var currentStroke = this.boardLinesX.length - 1;

      if(!isNaN(x) && !isNaN(y)){
        this.boardLinesX[currentStroke].push(x);
        this.boardLinesY[currentStroke].push(y);
      }
    }
  }

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

