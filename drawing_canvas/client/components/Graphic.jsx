import React, { Component } from 'react';
import { Point, PDollarRecognizer } from './PDollar.js'
import RecognitionCanvas from './RecognitionCanvas.jsx'

import InkStore from '../stores/InkStore.js';

export default class Graphic extends Component{

  constructor(props){
    super(props);

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
    
    this.addToBoard = this.addToBoard.bind(this);
    this.addGesture = this.addGesture.bind(this);
    this.deleteGesture = this.deleteGesture.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.getSquareNumber = this.getSquareNumber.bind(this);
    this.beautifyBoard = this.beautifyBoard.bind(this);
    this.drawBoardAndBeautifiedGestures = this.drawBoardAndBeautifiedGestures.bind(this);

    this.checkWinLogic = this.checkWinLogic.bind(this);
    this.test = this.test.bind(this);

    this.dollarP = this.dollarP.bind(this);
    this.dollarN = this.dollarN.bind(this);

    this.doLogic = this.doLogic.bind(this);
  }

  test(){
    this.recognitionCanvas.undo();
    this.recognitionCanvas.clearCanvas();
  }

  
  dollarP(){
    this.recognitionCanvas.setRecognitionAlgorithm("$p");
  }
  dollarN(){
    this.recognitionCanvas.setRecognitionAlgorithm("$n");
  }


  componentWillMount(){
    InkStore.on("change", () =>{
      this.setState({
        title: TitleStore.getColour(),
      });
    })
  }

  componentDidMount(){
    this.recognitionCanvas = this.refs.recognitionCanvas;
    this.recognitionCanvas.setRecognitionAlgorithm("$p");
    this.recognitionCanvas.setRecognitionListener(this.doLogic);

    this.canvas = this.refs.context;
    window.canvas = this.canvas;
  }

  doLogic(shape){
    console.log("recognized " + shape);
  }

  addGesture(e){
    e.preventDefault();
    var form = e.target;
    var gestureName = form.querySelector('[name="gesturename"]').value;
    this.recognitionCanvas.addGesture(gestureName);
  }

  deleteGesture(name){
    var gestureName = name;
    this.recognitionCanvas.deleteGesture(gestureName);
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


  onColorChange(e){
  		this.color = e.currentTarget.value;
  }

  render(){
    return (
      <div>
        <RecognitionCanvas ref="recognitionCanvas"/>
        <input type="submit" onClick={this.test} value="Clear Sketchpad" id="clearbutton"  />

        <input type="submit" onClick={this.dollarP} value="$P" id="clearbutton"  />
        <input type="submit" onClick={this.dollarN} value="$N" id="clearbutton"  />

        <form onSubmit={this.addGesture}>
          <input type="text" name="gesturename" id="gesturename"/>
          <input type="submit" value="Add Geture" id="addgesturebutton"  />
        </form>
        <form action="">
    			<input type="radio" name="color" value="#df4b26" onChange={this.onColorChange} defaultChecked={true}/> Red<br/>
    			<input type="radio" name="color" value="#0000FF" onChange={this.onColorChange}/> Blue<br/>
    			<input type="radio" name="color" value="#000000" onChange={this.onColorChange}/> Black
 		    </form>      
      </div>
      );

    /*
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
    */
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

