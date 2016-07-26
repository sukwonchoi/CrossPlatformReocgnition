import React, { Component } from 'react';
import RecognitionCanvas from './RecognitionCanvas/RecognitionCanvas.jsx'
import ColorPicker from './ColorPicker.jsx'
import {Tabs, Tab, Snackbar, FontIcon} from 'material-ui';
import ActionFlightTakeoff from 'material-ui/svg-icons/action/flight-takeoff';
import AvReplay from 'material-ui/svg-icons/av/replay';
import Undo from 'material-ui/svg-icons/content/undo';
import Redo from 'material-ui/svg-icons/content/redo';
import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import ImageColorLens from 'material-ui/svg-icons/image/color-lens';
import Replay from 'material-ui/svg-icons/av/replay';

import { SwatchesPicker } from 'react-color';
import InkStore from '../stores/InkStore.js';

export default class Graphic extends Component{

  constructor(props){
    super(props);

    super();
    this.state = {
      color: InkStore.getColour(),
      displayColorPicker: false,
      showSnackbar: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);

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

    this.callUndo = this.callUndo.bind(this);
    this.callRedo = this.callRedo.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    window.clearCanvas = this.clearCanvas;

    this.undoCallback = this.undoCallback.bind(this);
    this.redoCallback = this.redoCallback.bind(this);

    //Board/Game-state logic
    this.horizontalLines = new Array();
    this.verticalLines = new Array();
    this.board = [["", "", ""], ["", "", ""], ["", "", ""]];
    this.boardDrawn = false;

    this.recognitionCallback = this.recognitionCallback.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.snackBarClose = this.snackBarClose.bind(this);

    this.snackBarMessage = "Hi";
    this.lastShape = "";
  }

  callUndo(){
    this.recognitionCanvas.undo();
  }

  callRedo(){
    this.recognitionCanvas.redo();
  }

  clearCanvas(){
    console.log('clear canvas');
    this.recognitionCanvas.clearCanvas();
    this.board = [["", "", ""], ["", "", ""], ["", "", ""]];
    this.horizontalLines.length = 0;
    this.verticalLines.length = 0;
    this.boardDrawn = false;

    this.snackBarMessage = "Canvas cleared";
    this.setState({ showSnackbar: true });
  }

  handleChange(color){
    console.log(color);
    this.setState({ color: color.hex });
    this.setState({ displayColorPicker: false});
    this.recognitionCanvas.setColor(this.state.color);

  }

  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose() {
    console.log("handle close");
    this.setState({ displayColorPicker: false });
  };

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

  snackBarClose(){
    this.snackBarMessage = "";
    this.setState({ showSnackbar: false });
  }

  componentDidMount(){
    this.recognitionCanvas = this.refs.recognitionCanvas;
    this.recognitionCanvas.setRecognitionAlgorithm("$p");
    this.recognitionCanvas.setRecognitionTime(1000);
    this.recognitionCanvas.setRecognitionListener(this.recognitionCallback);
    this.recognitionCanvas.setUndoListener(this.undoCallback);
    this.recognitionCanvas.setRedoListener(this.redoCallback);
    this.recognitionCanvas.enableGesture("Horizontal Line");
    this.recognitionCanvas.enableGesture("Vertical Line");
    this.recognitionCanvas.disableGesture("X");
    this.recognitionCanvas.disableGesture("O");
    this.canvas = this.refs.context;
    window.canvas = this.canvas;
  }

  undoCallback(gesture){

    var undoShape = gesture.shape;
    var undoXCentre = gesture.centreX;
    var undoYCentre = gesture.centreY;
    var undoPointArray = gesture.strokes;

    if(undoShape == "X" || undoShape == "O"){
      var squareNumber = this.getSquareNumber(undoXCentre, undoYCentre);
      var row = Math.floor((squareNumber-1) / 3);
      var column = (squareNumber-1) % 3;
      this.board[row][column] = "";

      if(undoShape == "X"){
        this.lastShape = "O";
      }
      else{
        this.lastShape = "X";
      }
    }
    else{
      if(undoShape == "Vertical Line"){
        this.verticalLines.pop();
      }
      else if(undoShape == "Horizontal Line"){
        this.horizontalLines.pop();
      }
    }

    this.snackBarMessage = "Called undo on shape: " + undoShape;
    this.setState({ showSnackbar: true });
  }

  redoCallback(gesture){
    var redoShape = gesture.shape;
    var redoXCentre = gesture.centreX;
    var redoYCentre = gesture.centreY;
    var redoPointArray = gesture.strokes;

    if(redoShape == "X" || redoShape == "O"){
      var squareNumber = this.getSquareNumber(redoXCentre, redoYCentre);
      var row = Math.floor((squareNumber-1) / 3);
      var column = (squareNumber-1) % 3;
      this.board[row][column] = redoShape;
      this.lastShape = redoShape;
    }
    else{
      if(redoShape == "Vertical Line"){
        this.verticalLines.push(redoPointArray[0]);
      }
      else if(redoShape == "Horizontal Line"){
        this.horizontalLines.push(redoPointArray[0]);
      }
    }

    this.snackBarMessage = "Called redo on shape: " + redoShape;
    this.setState({ showSnackbar: true });
  }

  recognitionCallback(gesture){

    var shape = gesture.shape;
    var score = gesture.score;
    var centreOfGestureX = gesture.centreX;
    var centreOfGestureY = gesture.centreY;
    var pointArray = gesture.strokes;

    console.log("recognized: "       + shape);
    console.log("score: "            + score);
    console.log("centreOfGestureX: " + centreOfGestureX);
    console.log("centreOfGestureY: " + centreOfGestureY);
    console.log("stroke count:" + pointArray.length);
    console.log("point count:"  + pointArray[0].length);

    if(this.boardDrawn){
      if(shape == "Horizontal Line" || shape == "Vertical Line"){
        this.recognitionCanvas.undo();
        this.snackBarMessage = "Please draw the X or O";
        this.setState({ showSnackbar: true });
        return;
      }
      var squareNumber = this.getSquareNumber(centreOfGestureX, centreOfGestureY);
      var row = Math.floor((squareNumber-1) / 3);
      var column = (squareNumber-1) % 3;

      if(this.lastShape == shape){
        this.recognitionCanvas.undo();
        this.snackBarMessage = "It is not your turn!";
        this.setState({ showSnackbar: true });
        return;
      }

      this.lastShape = shape;
      if(this.board[row][column] == ""){
        this.board[row][column] = shape;
      }
      else{
        this.recognitionCanvas.undo();
        this.snackBarMessage = "Draw somewhere else!";
        this.setState({ showSnackbar: true });
        return;
      }


      if(this.checkWinLogic(row, column, shape)){
        this.recognitionCanvas.clearCanvas();
        this.recognitionCanvas.enableGesture("Horizontal Line");
        this.recognitionCanvas.enableGesture("Vertical Line");
        this.recognitionCanvas.disableGesture("X");
        this.recognitionCanvas.disableGesture("O");
        this.horizontalLines = new Array();
        this.verticalLines = new Array();
        this.board = [["", "", ""], ["", "", ""], ["", "", ""]];
        this.boardDrawn = false;
        this.lastShape = "";
      }
    }
    else{
      if(shape == "X" || shape == "O"){
        this.recognitionCanvas.undo();
        this.snackBarMessage = "Please draw the board first";
        this.setState({ showSnackbar: true });
      }
      else if(shape == "Horizontal Line"){
        this.horizontalLines.push(pointArray[0]);
        if(this.horizontalLines.length > 2){
          this.recognitionCanvas.undo();
          this.snackBarMessage = "Please draw the vertical lines";
          this.setState({ showSnackbar: true });
        }
      }
      else if(shape == "Vertical Line"){
        this.verticalLines.push(pointArray[0]);
        if(this.verticalLines.length > 2){
          this.recognitionCanvas.undo();
          this.snackBarMessage = "Please draw the horizontal lines";
          this.setState({ showSnackbar: true });
        }
      }
    }

    if(!this.boardDrawn){
      if(this.horizontalLines.length == 2 && this.verticalLines.length == 2){
        this.boardDrawn = true;
        this.recognitionCanvas.disableGesture("Horizontal Line");
        this.recognitionCanvas.disableGesture("Vertical Line");
        this.recognitionCanvas.enableGesture("X");
        this.recognitionCanvas.enableGesture("O");
        this.snackBarMessage = "Board has been drawn";
        this.setState({ showSnackbar: true });
      }
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
    console.log(this.board);
    for(i = 0; i < n; i++){
      if(this.board[x][i] != s){
        break;
      }
      if(i == n-1){
        this.snackBarMessage = s + " wins!";
        this.setState({ showSnackbar: true });
        return true;
      }
    }

    //check row
    for(i = 0; i < n; i++){
      if(this.board[i][y] != s){
        break;
      }
      if(i == n-1){
        this.snackBarMessage = s + " wins!";
        this.setState({ showSnackbar: true });
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
          this.snackBarMessage = s + " wins!";
          this.setState({ showSnackbar: true });
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
        this.snackBarMessage = s + " wins!";
        this.setState({ showSnackbar: true });
        return true;
      }
    }

    //check if game is finished
    for(i = 0; i < n; i++){
      for(j = 0; j < n; j++){
        if(this.board[i][j] == ""){
          return false;
        }
      }
    }

    //if game is finished and no winner, its a draw
    this.snackBarMessage = "It's a draw!";
    this.setState({ showSnackbar: true });
    return true;
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

  render(){

    var right = Math.round(screen.width / 4);
    var bottom = Math.round(screen.height / 4);

    const popover = {
      position: 'fixed',
      bottom: '50%',
      right: '50%',
      zIndex: '2',
    }

    const cover = {
      position: 'relative',
      top: 0,
      right: '50px',
      bottom: '45px',
      left: 0,
    }

    const tabsStyle = {
      position:'fixed',
      bottom:0,
      left:0,
      width:'100%',
      height:'60px',
    }

    const tabStyle = {
      height: '60px',
    }

    const inkBarStyle = {
      visibility: 'hidden',
      height:'0px',
      width:'0px',
    }

    const snackBarStyle = {
      bottom: '60px',
    }

    return (
      <div>
        <RecognitionCanvas ref="recognitionCanvas"/>

         <Snackbar
          open={this.state.showSnackbar}
          message={this.snackBarMessage}
          autoHideDuration={3000}
          onRequestClose={this.snackBarClose}
          style={snackBarStyle}
        />

        { this.state.displayColorPicker ? 
              <div id="colorPicker" style={ popover }>
                <div style={ cover } onClick={ this.handleClose }/>
                <SwatchesPicker onChangeComplete={ this.handleChange }/>
            </div> : null }

        <Tabs style={ tabsStyle } inkBarStyle={ inkBarStyle } tabItemContainerStyle={ tabStyle }>
          <Tab onActive={this.callUndo} icon={<Undo />} style ={ tabStyle }/>
          <Tab onActive={this.callRedo} icon={<Redo />} style ={ tabStyle }/>
          <Tab onActive={ this.clearCanvas } icon={<Replay />} style ={ tabStyle }/>
          <Tab onActive={ this.handleClick } icon={<ImageColorLens />} style ={ tabStyle }>
          </Tab>  
        </Tabs>

        </div>
        
      );
  }
}