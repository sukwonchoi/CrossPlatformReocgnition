import React, { Component } from 'react';
import { Point, PDollarRecognizer } from './PDollar.js'

export default class MainMenu extends Component{

	constructor(props){
    	super(props);


    	this.takePhoto = this.takePhoto.bind(this); 
    	this.recognize = this.recognize.bind(this);
    	this.getPixelXY = this.getPixelXY.bind(this);
    	this.getPixel = this.getPixel.bind(this);


    	this.state = {
	      src: "",
	    };
  	}

  	componentDidMount(){
	    this.canvasForPhotos = this.refs.contextForPhotos;
	    this.contextForPhotos = this.canvasForPhotos.getContext('2d');
	    this.pdollarForPhotos = new PDollarRecognizer();
  	}

  	takePhoto(e){
  		var cameraOptions = {
            width: 600,
            height: 400
        };
        MeteorCamera.getPicture(cameraOptions, (error, data) => {
           if (!error) {
               //template.$('.photo').attr('src', data); 
               console.log(data);
               this.setState({
			   	src: data,
			   });
           }
        });
        e.preventDefault();
  	}

  	recognize(e){

  		this.contextForPhotos.clearRect(0, 0, this.canvasForPhotos.width, this.canvasForPhotos.height);

  		var pix = e.target;
  		var tempCanvas = document.createElement('canvas');
		tempCanvas.width = pix.width;
		tempCanvas.height = pix.height;
		tempCanvas.getContext('2d').drawImage(pix, 0, 0, pix.width, pix.height);

		var imgd = tempCanvas.getContext('2d').getImageData(0, 0, tempCanvas.width, tempCanvas.height);
		var pointArray = new Array();

		console.log(imgd.data.length);

		for(var x = 0; x < tempCanvas.width; x++){
			for(var y = 0; y < tempCanvas.height; y++){
				var rgbValues = this.getPixelXY(imgd, x, y);

				/*if(Math.abs(rgbValues[0] - rgbValues[1]) < 60){
					if(rgbValues[0] < rgbValues[2	] - 80 && rgbValues[1] < rgbValues[2] - 80){
						var point = new Point(x, y, 2);
						pointArray.push(point);
					}
				}*/

				var lum = 0.2126 * rgbValues[0] + 0.7152 * rgbValues[1] + 0.03 * rgbValues[2];
				var color = lum < 80 ? "black" : "white";

				if(color == "black"){
					var point = new Point(x, y, 2);
					pointArray.push(point);
				}
			}
		}

		for(var i = 0; i < pointArray.length; i++){
			this.contextForPhotos.fillRect(pointArray[i].X, pointArray[i].Y, 1, 1);
		}


		console.log(pointArray.length);

		console.log(this.pdollarForPhotos.Recognize(pointArray).Name);
		console.log(this.pdollarForPhotos.Recognize(pointArray).Score);
  	}

  	getPixelXY(imageData, x, y){
  		return this.getPixel(imageData, y * imageData.width + x);
  	}

  	getPixel(imageData, index){
  		var i = index * 4, d = imageData.data;
  		return [d[i], d[i+1], d[i+2]];
  	}

	render(){
		return(
				<div>
					<canvas width={screen.width} height={screen.height - 60} ref="contextForPhotos" />
					<input type="submit" onClick={this.takePhoto} value="Take Photo" id="takePhotoButton"  />
					<img class="photo" src={this.state.src} onClick={this.recognize}/>
				</div>
			);
	}
}