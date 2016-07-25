import React, { Component } from 'react';
import { Point, PDollarRecognizer } from './PDollar.js'
import { NDollarRecognizer } from './NDollar.js'

export function Beautifier() // constructor
{
	this.beautificationAlgorithm = new Array();

	this.Beautify = function(shape, strokes)
	{
		//If an overiding algorithm is present
		if(this.beautificationAlgorithm[shape]){
			return this.beautificationAlgorithm[shape](shape, strokes);
		}


		if(shape == "X"){
			var points = strokes.pop();
			var points2 = strokes.pop();

			var xArray = new Array();
			var yArray = new Array();

			for(var i = 0; i < points.length; i++){
				xArray.push(points[i].X);
				yArray.push(points[i].Y);
			}

			if(!(points2 === undefined)){
				for(var i = 0; i < points2.length; i++){
				xArray.push(points2[i].X);
				yArray.push(points2[i].Y);
				}
			}

			var xMax = Math.max.apply(Math, xArray);
		    var xMin = Math.min.apply(Math, xArray);
		    var xDiff = xMax - xMin;
		    var xCentre = (xMax + xMin) / 2;

		    var yMax = Math.max.apply(Math, yArray);
		    var yMin = Math.min.apply(Math, yArray);
		    var yDiff = yMax - yMin;
		    var yCentre = (yMax + yMin) / 2;

		    var radius = xDiff < yDiff ? Math.round(xDiff/2 * 0.85) : Math.round(yDiff/2 * 0.85);

		    var xSmall = xCentre - radius;
		    var xLarge = xCentre + radius;
		    var ySmall = yCentre - radius;
		    var yLarge = yCentre + radius;

		    var leftTop 	= new Point(xSmall, yLarge, 1);
		    var rightTop 	= new Point(xLarge, yLarge, 1);
		    var leftBottom 	= new Point(xSmall, ySmall, 1);
		    var rightBottom = new Point(xLarge, ySmall, 1);

		    var newLineDiag = new Array();
		    newLineDiag.push(leftTop);
		    newLineDiag.push(rightBottom);
		    var newLineAntiDiag = new Array();
		    newLineAntiDiag.push(rightTop);
		    newLineAntiDiag.push(leftBottom);
		    var newGesture = new Array();
		    newGesture.push(newLineDiag);
		    newGesture.push(newLineAntiDiag);

		    return newGesture;
		}
		else if(shape == "O"){
			var points = strokes.pop();
			var xArray = new Array();
			var yArray = new Array();

			for(var i = 0; i < points.length; i++){
				xArray.push(points[i].X);
				yArray.push(points[i].Y);
			}

			var xMax = Math.max.apply(Math, xArray);
		    var xMin = Math.min.apply(Math, xArray);
		    var xDiff = xMax - xMin;
		    var xCentre = (xMax + xMin) / 2;

		    var yMax = Math.max.apply(Math, yArray);
		    var yMin = Math.min.apply(Math, yArray);
		    var yDiff = yMax - yMin;
		    var yCentre = (yMax + yMin) / 2;

		    var radius = xDiff < yDiff ? Math.round(xDiff/2 * 0.85) : Math.round(yDiff/2 * 0.85);

		    var newLine = new Array();
		    var steps = 32;
		    for(var granularity = 0; granularity < steps; granularity++) {
					var xPoint = Math.round(xCentre + (radius * Math.cos(2 * Math.PI * granularity / steps)));
					var yPoint = Math.round(yCentre + (radius * Math.sin(2 * Math.PI * granularity / steps)));	
					var newPoint = new Point(xPoint, yPoint, 1);
					newLine.push(newPoint);			
			}
			newLine.push(newLine[0]);
			var newGesture = new Array();
			newGesture.push(newLine);
			
			return newGesture;
		}
		else if(shape == "Vertical Line"){
			var points = strokes.pop();
			var firstPoint = points[0];
			var lastPoint = points[points.length - 1];

			var averageX = (firstPoint.X + lastPoint.X) / 2;
			var newPoint1 = new Point(averageX, firstPoint.Y, 1);
			var newPoint2 = new Point(averageX, lastPoint.Y, 1);

			var newLine = new Array();
			newLine.push(newPoint1);
			newLine.push(newPoint2);
			var newGesture = new Array();
			newGesture.push(newLine);
			
			return newGesture;
		}
		else if(shape == "Horizontal Line"){
			var points = strokes.pop();
			var firstPoint = points[0];
			var lastPoint = points[points.length - 1];

			var averageY = (firstPoint.Y + lastPoint.Y) / 2;
			var newPoint1 = new Point(firstPoint.X, averageY, 1);
			var newPoint2 = new Point(lastPoint.X, averageY, 1);

			var newLine = new Array();
			newLine.push(newPoint1);
			newLine.push(newPoint2);
			var newGesture = new Array();
			newGesture.push(newLine);
			
			return newGesture;
		}
		else{
			console.log("shape not found");
			return;
		}
	};

	this.AddBeautificationAlgorithm = function(shape, algorithm){
		this.beautificationAlgorithm[shape] = algorithm;
	}
}
