import React, { Component } from 'react';
import RecognitionCanvas from 'recognition-canvas';
import Gesture from 'recognition-canvas';
import ColorPicker from './ColorPicker.jsx';
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

  state = {
      color: InkStore.getColour(),
      displayColorPicker: false,
      showSnackbar: false,
      enabledGestures: ["Vertical Line", "Horizontal Line"],
      disabledGestures: ["X", "O"],
      recognitionAlgorithm: "$p",
      recognitionTime: 0,
      redo: false,
      undo: false,
      color: InkStore.getColour(),
      clearRecognitionCanvas: false,
  };

  constructor(props){
    super(props);

    //Board/Game-state logic
    this.horizontalLines = new Array();
    this.verticalLines = new Array();
    this.board = [["", "", ""], ["", "", ""], ["", "", ""]];
    this.boardDrawn = false;
    this.snackBarMessage = "";
    this.gestureArray = new Array();
    this.duration = 3000;
    this.actionMessage = "";

    //Function binding
    this.recognitionCallback = this.recognitionCallback.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.snackBarClose = this.snackBarClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addGesture = this.addGesture.bind(this);
    this.deleteGesture = this.deleteGesture.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.getSquareNumber = this.getSquareNumber.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    window.clearCanvas = this.clearCanvas;
    this.undoCallback = this.undoCallback.bind(this);
    this.redoCallback = this.redoCallback.bind(this);
    this.clearCanvasCallback = this.clearCanvasCallback.bind(this);
    this.callUndo = this.callUndo.bind(this);
    this.callRedo = this.callRedo.bind(this);
    this.endGameSnackBarClose = this.endGameSnackBarClose.bind(this);
    this.applyShapesToBoard = this.applyShapesToBoard.bind(this);
    this.applyLinesToBoard = this.applyLinesToBoard.bind(this);
    this.boardDrawnIsValid = this.boardDrawnIsValid.bind(this);

    this.snackBarClosing = this.snackBarClose;
  }

  callUndo(){
    if(!this.boardDrawn){
      if(this.verticalLines.length == 0 && this.horizontalLines.length == 0){
        return;
      }
    }
    else{
      if(this.gestureArray.length == 0){
        return;
      }
    } 

    this.setState({ undo: true });
  }

  callRedo(){
    this.setState({ redo: true });
  }

  clearCanvas(){
    this.setState({ 
      enabledGestures: ["Vertical Line", "Horizontal Line"],
      disabledGestures: ["X", "O"],
      clearRecognitionCanvas: true,
      recognitionTime: 0,
    });
    
    this.horizontalLines = new Array();
    this.verticalLines = new Array();
    this.gestureArray = new Array();
    this.board = [["", "", ""], ["", "", ""], ["", "", ""]];
    this.boardDrawn = false;
    this.snackBarMessage = "";
  }

  handleChange(color){
    this.setState({ 
      color: color.hex,
      displayColorPicker: false
    });
  }

  handleClick() {    
    console.log("Handle close triggered");
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose() {
    console.log("handle close called");
    this.setState({ displayColorPicker: false });
  };

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

  endGameSnackBarClose(){
    this.duration = 3000;
    this.snackBarMessage = "";
    this.snackBarClosing = this.snackBarClose;
    this.actionMessage = "";
    this.clearCanvas();
    this.setState({ showSnackbar: false });
  }

  componentDidMount(){
    this.recognitionCanvas = this.refs.recognitionCanvas;
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
      this.gestureArray.pop();
      if(this.board[row][column].length == 2){
        this.board[row][column] = this.board[row][column].charAt(0);
      }
      else{
        this.board[row][column] = "";
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

    this.setState({ 
      undo: false
    });
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
      this.gestureArray.push(redoShape);
    }
    else{
      if(redoShape == "Vertical Line"){
        this.verticalLines.push(redoPointArray[0]);
      }
      else if(redoShape == "Horizontal Line"){
        this.horizontalLines.push(redoPointArray[0]);
      }
    }

    this.setState({ 
      redo: false
    });
  }

  clearCanvasCallback(){
    this.setState({
      clearRecognitionCanvas: false,
    });
  }

  recognitionCallback(gesture){
    
    console.log(gesture);

    if(this.boardDrawn){
      this.applyShapesToBoard(gesture);
    }
    else{
      this.applyLinesToBoard(gesture);
    }

    if(!this.boardDrawn){
      if(this.horizontalLines.length == 2 && this.verticalLines.length == 2){
        if(this.boardDrawnIsValid()){
          this.boardDrawn = true;
          this.snackBarMessage = "Board has been drawn";
          this.setState({
            disabledGestures: ["Vertical Line", "Horizontal Line"],
            enabledGestures: ["X", "O"],
            recognitionTime: 1000,
            showSnackbar: true,
          });
        }
        else{
          this.clearCanvas();
          this.snackBarMessage = "Draw the board properly!";
          this.setState({ 
            showSnackbar: true,
          });
        }
      }
    }
  }

  boardDrawnIsValid(){
    var verticalOne = this.verticalLines[0];
    var verticalTwo = this.verticalLines[1];
    var verticalOneHigherPoint = verticalOne[0].Y > verticalOne[1].Y ? verticalOne[0] : verticalOne[1];
    var verticalOneLowerPoint  = verticalOne[0].Y > verticalOne[1].Y ? verticalOne[1] : verticalOne[0];
    var verticalTwoHigherPoint = verticalTwo[0].Y > verticalTwo[1].Y ? verticalTwo[0] : verticalTwo[1];
    var verticalTwoLowerPoint  = verticalTwo[0].Y > verticalTwo[1].Y ? verticalTwo[1] : verticalTwo[0];

    var horizontalOne = this.horizontalLines[0];
    var horizontalTwo = this.horizontalLines[1];
    var horizontalOneLeftPoint  = horizontalOne[0].X < horizontalOne[1].X ? horizontalOne[0] : horizontalOne[1];
    var horizontalOneRightPoint = horizontalOne[0].X < horizontalOne[1].X ? horizontalOne[1] : horizontalOne[0];
    var horizontalTwoLeftPoint  = horizontalTwo[0].X < horizontalTwo[1].X ? horizontalTwo[0] : horizontalTwo[1];
    var horizontalTwoRightPoint = horizontalTwo[0].X < horizontalTwo[1].X ? horizontalTwo[1] : horizontalTwo[0];

    var verticalOneCheck = (
                            verticalOneHigherPoint.Y > horizontalOneLeftPoint.Y &&
                            verticalOneHigherPoint.Y > horizontalOneRightPoint.Y &&
                            verticalOneHigherPoint.Y > horizontalTwoLeftPoint.Y &&
                            verticalOneHigherPoint.Y > horizontalTwoRightPoint.Y &&
                            verticalOneLowerPoint.Y < horizontalOneLeftPoint.Y &&
                            verticalOneLowerPoint.Y < horizontalOneRightPoint.Y &&
                            verticalOneLowerPoint.Y < horizontalTwoLeftPoint.Y &&
                            verticalOneLowerPoint.Y < horizontalTwoRightPoint.Y 
                           ) ? true : false;
    
    var verticalTwoCheck = (
                            verticalTwoHigherPoint.Y > horizontalOneLeftPoint.Y &&
                            verticalTwoHigherPoint.Y > horizontalOneRightPoint.Y &&
                            verticalTwoHigherPoint.Y > horizontalTwoLeftPoint.Y &&
                            verticalTwoHigherPoint.Y > horizontalTwoRightPoint.Y &&
                            verticalTwoLowerPoint.Y < horizontalOneLeftPoint.Y &&
                            verticalTwoLowerPoint.Y < horizontalOneRightPoint.Y &&
                            verticalTwoLowerPoint.Y < horizontalTwoLeftPoint.Y &&
                            verticalTwoLowerPoint.Y < horizontalTwoRightPoint.Y 
                           ) ? true : false;
    
    var horizontalOneCheck = (
                            horizontalOneLeftPoint.X < verticalOneHigherPoint.X &&
                            horizontalOneLeftPoint.X < verticalOneLowerPoint.X &&
                            horizontalOneLeftPoint.X < verticalTwoHigherPoint.X &&
                            horizontalOneLeftPoint.X < verticalTwoLowerPoint.X &&
                            horizontalOneRightPoint.X > verticalOneHigherPoint.X &&
                            horizontalOneRightPoint.X > verticalOneLowerPoint.X &&
                            horizontalOneRightPoint.X > verticalTwoHigherPoint.X &&
                            horizontalOneRightPoint.X > verticalTwoLowerPoint.X 
                              ) ? true : false;
    var horizontalTwoCheck = (
                            horizontalTwoLeftPoint.X < verticalOneHigherPoint.X &&
                            horizontalTwoLeftPoint.X < verticalOneLowerPoint.X &&
                            horizontalTwoLeftPoint.X < verticalTwoHigherPoint.X &&
                            horizontalTwoLeftPoint.X < verticalTwoLowerPoint.X &&
                            horizontalTwoRightPoint.X > verticalOneHigherPoint.X &&
                            horizontalTwoRightPoint.X > verticalOneLowerPoint.X &&
                            horizontalTwoRightPoint.X > verticalTwoHigherPoint.X &&
                             horizontalTwoRightPoint.X > verticalTwoLowerPoint.X 
                             ) ? true : false;


    return (verticalOneCheck && verticalTwoCheck && horizontalOneCheck && horizontalTwoCheck);
  }

  applyShapesToBoard(gesture){
    var shape = gesture.shape;
    var score = gesture.score;
    var centreOfGestureX = gesture.centreX;
    var centreOfGestureY = gesture.centreY;
    var pointArray = gesture.strokes;
    
    console.log(this.board);

    var minX = 9999999999;
    var minY = 9999999999;
    var maxX = 0;
    var maxY = 0;

    for(var i = 0; i < pointArray.length; i++){
      for(var j = 0; j < pointArray[i].length; j++){
        var point = pointArray[i][j];
        maxX = point.X > maxX ? point.X : maxX;
        maxY = point.Y > maxY ? point.Y : maxY;
        minX = point.X < minX ? point.X : minX;
        minY = point.Y < minY ? point.Y : minY;
      }
    }

    var pointCheckOne =   this.getSquareNumber(centreOfGestureX, maxY);
    var pointCheckTwo =   this.getSquareNumber(centreOfGestureX, minY);
    var pointCheckThree = this.getSquareNumber(maxX, centreOfGestureY);
    var pointCheckFour =  this.getSquareNumber(minX, centreOfGestureY);

    var squareNumber = this.getSquareNumber(centreOfGestureX, centreOfGestureY);

    var isValidDrawing = (
                            pointCheckOne == pointCheckTwo &&
                            pointCheckTwo == pointCheckThree &&
                            pointCheckThree == pointCheckFour &&
                            pointCheckFour == squareNumber
                         ) ? true : false;

    var row = Math.floor((squareNumber-1) / 3);
    var column = (squareNumber-1) % 3;

    if(this.gestureArray[this.gestureArray.length - 1] == shape){
      this.gestureArray.push(shape);
      this.board[row][column] = this.board[row][column] + "L";
      this.snackBarMessage = "It is not your turn!";
      this.setState({
        undo: true,
        showSnackbar: true
      });
      return;
    }

    this.gestureArray.push(shape);

    if(score == 0){
        this.board[row][column] = this.board[row][column] + "L";
        this.snackBarMessage = "Please draw the shapes more carefully";
        this.setState({ 
          showSnackbar: true,
          undo: true
        });
        return;
    }

    if(!isValidDrawing){
      this.board[row][column] = this.board[row][column] + "L";
      this.snackBarMessage = "Please draw inside one of the slots!";
      this.setState({
        undo: true,
        showSnackbar: true
      });
      return;
    }
    
    if(this.board[row][column] == ""){
      this.board[row][column] = shape;
    }
    else{
      this.board[row][column] = this.board[row][column] + "L";
      this.snackBarMessage = "Draw somewhere else!";
      this.setState({
        undo: true,
        showSnackbar: true
      });
      return;
    }

    this.checkWinLogic(row, column, shape);
  }

  applyLinesToBoard(gesture){
    var shape = gesture.shape;
    var score = gesture.score;
    var centreOfGestureX = gesture.centreX;
    var centreOfGestureY = gesture.centreY;
    var pointArray = gesture.strokes;
    
    if(score < 0.85){
        this.snackBarMessage = "Please draw the lines more carefully";
        if(shape == "Horizontal Line"){
          this.horizontalLines.push(pointArray[0]);
        }
        else{
          this.verticalLines.push(pointArray[0]);
        }
        this.setState({ 
          showSnackbar: true,
          undo: true
        });
        return;
      }
      else if(shape == "Horizontal Line"){
        this.horizontalLines.push(pointArray[0]);
        if(this.horizontalLines.length > 2){
          this.snackBarMessage = "Please draw the vertical lines";
          this.setState({ 
            showSnackbar: true,
            undo: true
          });
          return;
        }
      }
      else if(shape == "Vertical Line"){
        this.verticalLines.push(pointArray[0]);
        if(this.verticalLines.length > 2){
          this.snackBarMessage = "Please draw the horizontal lines";
          this.setState({ 
            showSnackbar: true,
            undo: true
          });
          return;
        }
      }
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

    console.log("X: " +  x);

    console.log("Y: " +  y);

    console.log("s: " +  s);

    for(i = 0; i < n; i++){
      console.log("ROW");
      if(this.board[x][i] != s){
        break;
      }
      if(i == n-1){
        this.snackBarMessage = s + " wins!";
        this.duration = 100000;
        this.actionMessage = "Clear";
        this.snackBarClosing = this.endGameSnackBarClose;
        this.setState({ 
          showSnackbar: true,
        });
        return;
      }
    }

    //check row
    for(i = 0; i < n; i++){
      console.log("COLUMN");
      if(this.board[i][y] != s){
        break;
      }
      if(i == n-1){
        this.snackBarMessage = s + " wins!";
        this.duration = 100000;
        this.actionMessage = "Clear";
        this.snackBarClosing = this.endGameSnackBarClose;
        this.setState({ 
          showSnackbar: true,
        });
        return;
      }
    }

      //check diag
    if(x == y){
      //we're on a diagonal
      for(i = 0; i < n; i++){
        console.log("DIAGONAL");
        if(this.board[i][i] != s){
          break;
        }
        if(i == n-1){
          this.snackBarMessage = s + " wins!";
          this.duration = 100000;
          this.actionMessage = "Clear";
          this.snackBarClosing = this.endGameSnackBarClose;
          this.setState({ 
            showSnackbar: true,
          });
          return;
        }
      }
    }

    //check anti diag (thanks rampion)
    for(i = 0;i<n;i++){
      console.log("ANTI-DIAGONAL");
      if(this.board[(n-1)-i][i] != s){
        break;
      }
      if(i == n-1){
        this.snackBarMessage = s + " wins!";
        this.duration = 100000;
        this.actionMessage = "Clear";
        this.snackBarClosing = this.endGameSnackBarClose;
        this.setState({ 
          showSnackbar: true,
        });
        return;
      }
    }

    //check if game is finished
    for(i = 0; i < n; i++){
      for(j = 0; j < n; j++){
        if(this.board[i][j] == ""){
          return;
        }
      }
    }

    //if game is finished and no winner, its a draw
    this.snackBarMessage = "It's a tie!";
    this.duration = 100000;
    this.actionMessage = "Clear";
    this.snackBarClosing = this.endGameSnackBarClose;
    this.setState({ 
      showSnackbar: true,
    });
  }

  getSquareNumber(x, y){
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

    var width = Math.round(screen.width / 2);
    var height = Math.round(screen.height / 2);

    //Styling
    const popover = {
      width: width,
      height: height,
      position: "absolute",
      top:0,
      bottom: 0,
      left: 0,
      right: 0,
      margin: "auto",
      zIndex: '2',
    }

    const cover = {
      position: 'relative',
      top: 0,
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

    //API input
    const recognitionListener = this.recognitionCallback;
    const undoListener = this.undoCallback;
    const redoListener = this.redoCallback;
    const clearCanvasListener = this.clearCanvasCallback;

    return (
      <div>
        <RecognitionCanvas 
          recognitionAlgorithm={this.state.recognitionAlgorithm}
          recognitionTime={this.state.recognitionTime}
          recognitionListener={recognitionListener}
          undoListener={undoListener}
          redoListener={redoListener}
          clearCanvasListener={clearCanvasListener}
          undo={this.state.undo}
          redo={this.state.redo}
          clearCanvas={this.state.clearRecognitionCanvas}
          beautification={true}
          color={this.state.color}
          width={String(screen.width)}
          height={String(screen.height - 120)}
          disabledGestures={this.state.disabledGestures}
          enabledGestures={this.state.enabledGestures}
          ref="recognitionCanvas"
        />

         <Snackbar
          action={this.actionMessage}
          open={this.state.showSnackbar}
          message={this.snackBarMessage}
          autoHideDuration={this.duration}
          onRequestClose={this.snackBarClosing}
          style={snackBarStyle}
          onActionTouchTap={this.snackBarClosing}
        />

        { this.state.displayColorPicker ? 
              <div id="colorPicker" style={ popover }>
                <div style={ cover } onClick={ this.handleClose }/>
                <SwatchesPicker onChangeComplete={ this.handleChange }/>
            </div> : null }

        <Tabs style={ tabsStyle } inkBarStyle={ inkBarStyle } tabItemContainerStyle={ tabStyle }>
          <Tab onActive={ this.callUndo } icon={<Undo />} style ={ tabStyle }/>
          <Tab onActive={ this.clearCanvas } icon={<Replay />} style ={ tabStyle }/>
          <Tab onActive={ this.handleClick } icon={<ImageColorLens />} style ={ tabStyle }/>
        </Tabs>

      </div>
        
    );
  }
}