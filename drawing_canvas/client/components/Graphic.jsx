import React, { Component } from 'react';
import { Point, PDollarRecognizer } from './PDollar.js'
import RecognitionCanvas from './RecognitionCanvas.jsx'

import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import ActionFlightTakeoff from 'material-ui/svg-icons/action/flight-takeoff';
import AvReplay from 'material-ui/svg-icons/av/replay';
import Undo from 'material-ui/svg-icons/content/undo';
import Redo from 'material-ui/svg-icons/content/redo';
import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import ImageColorLens from 'material-ui/svg-icons/image/color-lens';


import InkStore from '../stores/InkStore.js';

export default class Graphic extends Component{

  constructor(props){
    super(props);

    this.color = InkStore.getColour();
    console.log(InkStore.getColour());
    window.color = this.color;
    
    this.addGesture = this.addGesture.bind(this);
    this.deleteGesture = this.deleteGesture.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.getSquareNumber = this.getSquareNumber.bind(this);

    this.test = this.test.bind(this);

    this.dollarP = this.dollarP.bind(this);
    this.dollarN = this.dollarN.bind(this);

    //Board/Game-state logic
    this.horizontalLines = new Array();
    this.verticalLines = new Array();
    this.board = [["", "", ""], ["", "", ""], ["", "", ""]];
    this.boardDrawn = false;

    this.recognitionCallback = this.recognitionCallback.bind(this);
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
    this.recognitionCanvas.setRecognitionTime(1000);
    this.recognitionCanvas.setRecognitionListener(this.recognitionCallback);

    this.canvas = this.refs.context;
    window.canvas = this.canvas;
  }

  recognitionCallback(shape, score, centreOfGestureX, centreOfGestureY, pointArray){
    console.log("recognized: "       + shape);
    //console.log("score: "            + score);
    //console.log("centreOfGestureX: " + centreOfGestureX);
    //console.log("centreOfGestureY: " + centreOfGestureY);
    console.log("stroke count:" + pointArray.length);
    console.log("point count:"  + pointArray[0].length);

    if(this.boardDrawn){
      if(shape == "Horizontal Line" || shape == "Vertical Lines"){
        // undo
        // warn
        return;
      }
      var squareNumber = this.getSquareNumber(centreOfGestureX, centreOfGestureY);
      var row = Math.floor((squareNumber-1) / 3);
      var column = (squareNumber-1) % 3;

      console.log("Square Number: " + squareNumber);
      console.log("Row: " + row);
      console.log("Column: " + column);

      if(shape == "X"){
        this.board[row][column] = "X";
      }
      else if(shape == "O"){
        this.board[row][column] = "O";
      }

      console.log("Square number: " + squareNumber);
      console.log("Did someone win?: " + this.checkWinLogic(row, column, shape));
    }
    else{
      if(shape == "X" || shape == "O"){
        //undo
        //warn
      }
      else if(shape == "Horizontal Line"){
        if(this.horizontalLines.length == 2){
          //undo
          //warn
        }
        else{
          this.horizontalLines.push(pointArray[0]);
        }
      }
      else if(shape == "Vertical Line"){
        if(this.verticalLines.length == 2){
          //undo
          //warn
        }
        else{
          this.verticalLines.push(pointArray[0]);
        }
      }
    }

    if(this.verticalLines.length == 2 && this.horizontalLines.length == 2){
      this.boardDrawn = true;
    }

    console.log("Board Drawn: " + this.boardDrawn);
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

  checkWinLogic(x, y, s){
    var n = 3;
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

  getSquareNumber(x, y){

    console.log("X: " + x);
    console.log("Y: " + y);

    var xLeft = this.verticalLines[0][0].X < this.verticalLines[1][0].X ? this.verticalLines[0][0].X : this.verticalLines[1][0].X;
    var xRight = this.verticalLines[0][0].X > this.verticalLines[1][0].X ? this.verticalLines[0][0].X : this.verticalLines[1][0].X;
    var yTop = this.horizontalLines[0][0].Y > this.horizontalLines[1][0].Y ? this.horizontalLines[0][0].Y : this.horizontalLines[1][0].Y;
    var yBottom = this.horizontalLines[0][0].Y < this.horizontalLines[1][0].Y ? this.horizontalLines[0][0].Y : this.horizontalLines[1][0].Y;

    if(x < xLeft){
      if(y < yBottom){
        return 1;
      }
      else if(y < yTop){
        return 4;
      }
      else{
        return 7;
      }
    }
    else if(x < xRight){
      if(y < yBottom){
        return 2;
      }
      else if(y < yTop){
        return 5;
      }
      else{
        return 8;
      }
    }
    else{
      if(y < yBottom){
        return 3;
      }
      else if(y < yTop){
        return 6;
      }
      else{
        return 9;
      }
    }
  }

  onColorChange(e){
  		this.color = e.currentTarget.value;
  }
// <input type="submit" onClick={this.test} value="Clear Sketchpad" id="clearbutton"  />

//         <input type="submit" onClick={this.dollarP} value="$P" id="clearbutton"  />
//         <input type="submit" onClick={this.dollarN} value="$N" id="clearbutton"  />

//         <form onSubmit={this.addGesture}>
//           <input type="text" name="gesturename" id="gesturename"/>
//           <input type="submit" value="Add Geture" id="addgesturebutton"  />
//         </form>
//         <form action="">
//           <input type="radio" name="color" value="#df4b26" onChange={this.onColorChange} defaultChecked={true}/> Red<br/>
//           <input type="radio" name="color" value="#0000FF" onChange={this.onColorChange}/> Blue<br/>
//           <input type="radio" name="color" value="#000000" onChange={this.onColorChange}/> Black
//         </form>      
//       </div>
      // <ul>
      //       {
      //         this.state.gestureList.map(function(name){
      //               return <li key ={name}>
      //                         {name}
      //                         <input type="submit" name={name} value="Delete" onClick={() => this.deleteGesture(name)} />
      //                       </li>;
      //             })
      //       }
      //     </ul>
  render(){
    return (
      <div>
        <RecognitionCanvas ref="recognitionCanvas"/>

        <Tabs>
          <Tab icon={<Undo />} />
          <Tab icon={<Redo />} />
          <Tab icon={<ContentAddCircleOutline />} />
          <Tab className="basics" onActive={this.test} icon={<ImageColorLens />} />
        </Tabs>

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

