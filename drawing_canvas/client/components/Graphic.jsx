import React, { Component } from 'react';
import RecognitionCanvas from './RecognitionCanvas/RecognitionCanvas.jsx';
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

    this.snackBarClosing = this.snackBarClose;
  }

  callUndo(){
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
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose() {
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
      this.board[row][column] = "";
      this.gestureArray.pop();
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
    var shape = gesture.shape;
    var score = gesture.score;
    var centreOfGestureX = gesture.centreX;
    var centreOfGestureY = gesture.centreY;
    var pointArray = gesture.strokes;
    if(this.boardDrawn){
      if(score < 0.15){
        this.snackBarMessage = "Please draw the shapes more carefully";
        this.gestureArray.push(shape);
        this.setState({ 
          showSnackbar: true,
          undo: true
        });
        return;
      }

      var squareNumber = this.getSquareNumber(centreOfGestureX, centreOfGestureY);
      var row = Math.floor((squareNumber-1) / 3);
      var column = (squareNumber-1) % 3;

      if(this.gestureArray[this.gestureArray.length - 1] == shape){
        this.snackBarMessage = "It is not your turn!";
        this.gestureArray.push(shape);
        this.setState({
          undo: true,
          showSnackbar: true
        });
        return;
      }

      this.gestureArray.push(shape);
      if(this.board[row][column] == ""){
        this.board[row][column] = shape;
      }
      else{
        this.snackBarMessage = "Draw somewhere else!";
        this.gestureArray.push(shape);
        this.setState({
          undo: true,
          showSnackbar: true
        });
        return;
      }


      if(this.checkWinLogic(row, column, shape)){
        this.snackBarMessage = shape + " wins!";
        this.duration = 100000;
        this.actionMessage = "Clear";
        this.snackBarClosing = this.endGameSnackBarClose;
        this.setState({ 
          showSnackbar: true,
        });
      }
    }
    else{
      if(score < 0.5){
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

    if(!this.boardDrawn){
      if(this.horizontalLines.length == 2 && this.verticalLines.length == 2){
        this.boardDrawn = true;
        this.snackBarMessage = "Board has been drawn";
        this.setState({
          disabledGestures: ["Vertical Line", "Horizontal Line"],
          enabledGestures: ["X", "O"],
          recognitionTime: 1000,
          showSnackbar: true,
        });
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

    var right = Math.round(screen.width / 2);
    var bottom = Math.round(screen.height / 2);

    //Styling
    const popover = {
      position: 'absolute',
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
          beautification={true}
          color={this.state.color}
          clearCanvas={this.state.clearRecognitionCanvas}
          width={screen.width}
          height={screen.height - 120}
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
          <Tab onActive={this.callUndo} icon={<Undo />} style ={ tabStyle }/>
          <Tab onActive={this.callRedo} icon={<Redo />} style ={ tabStyle }/>
          <Tab onActive={ this.clearCanvas } icon={<Replay />} style ={ tabStyle }/>
          <Tab onActive={ this.handleClick } icon={<ImageColorLens />} style ={ tabStyle }/>
        </Tabs>

      </div>
        
    );
  }
}