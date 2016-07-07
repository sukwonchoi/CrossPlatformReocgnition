import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';

import InkStore from '../stores/InkStore.js';
import * as InkActions from '../actions/InkActions.js'

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export default class Settings extends Component{

	constructor(){
		super();
		this.inkHandler = this.inkHandler.bind(this);
		console.log("constructor");
    this.state = {
      colour: InkStore.getColour(),
    };
	}

  componentWillUnmount () {
    // allows us to ignore an inflight request in scenario 4
    console.log("component unmounting settings")
  }


	componentDidMount(){
		// this.setState(
		// 		{
		// 			colour: InkStore.getColour(),
		// 		}
		// 	);

		// console.log(InkStore.getColour());
			console.log("component did mount?")
		$('.ui.radio.checkbox').checkbox();
		switch(this.state.colour){
		// switch(InkStore.getColour()){
			case "#000000":
				$('.ui.radio.checkbox.black').checkbox('check');
				break;
			case "#0000FF":
				$('.ui.radio.checkbox.blue').checkbox('check');
				break;
			case "#df4b26":
				$('.ui.radio.checkbox.red').checkbox('check');
				break;
		}

		$('.ui.radio.checkbox.black')
			.checkbox()
			.first().checkbox({
				onChecked: function() {
					console.log("black");
					InkStore.setColour("#000000");
				}
		});
		$('.ui.radio.checkbox.blue')
			.checkbox()
			.first().checkbox({
				onChecked: function() {
					console.log("blue");
					InkStore.setColour("#0000FF");
				}
		});
		$('.ui.radio.checkbox.red')
			.checkbox()
			.first().checkbox({
				onChecked: function() {
					console.log("red");
					InkStore.setColour("#df4b26");
				}
		});	
	}

	inkHandler(colour){
    console.log(colour);
	  InkStore.setColour(colour)
	}
	
	// render(){
	// 	return(
	// 		<div className="ui container">
	// 			<div className="ui vertical accordion menu">
	// 				<div className="item">
	// 					<a className="active title">
	// 						<i className="dropdown icon"></i>
	// 						Color
	// 					</a>
	// 				</div>		
	// 			</div>
	// 		</div>
	// 		);
	// }		


	render(){
	    return (
	    	<div className="ui container">
					<h2 className="ui dividing header">
					  Ink Color
					</h2>
	    		<div className="ui form">
			    	<div className="grouped fields">
			    		<div className="ui field">
	 	 	  				<div className="ui radio checkbox black">
	 	   						<input type="radio" name="color" checked="" tabindex="0" class="hidden"/>
 	   							<label>Black</label>
								</div>
			    		</div>
			    		<div className="ui field">
		  	  			<div className="ui radio checkbox blue">
		    						<input type="radio" name="color" checked="" tabindex="0" class="hidden"/>
 	 	  							<label color="blue">Blue</label>
								</div>
			    		</div>
			    		<div className="ui field">
		  	  			<div className="ui radio checkbox red">
		    						<input type="radio" name="color" checked="" tabindex="0" class="hidden"/>
 	 	  							<label color="red">Red</label>
								</div>
			    		</div>
		    		</div>	
		    	</div>

					<h2 className="ui dividing header">
					  Gesture Templates
					</h2>

					<div className="ui form">
						<div className="grouped fields">
							<div className="ui field">
								<div className="ui toggle checkbox">
		 		 					<input type="checkbox" checked="checked" name="public" />
		  						<label>X</label>
		  						<i class="remove circle icon"></i>
								</div>
							</div>
							<div className="ui field">
								<div className="ui toggle checkbox">
		  						<input type="checkbox" checked="checked" name="public" />
		  						<label>O</label>
								</div>
							</div>
						</div>
					</div>
	    	</div>

	    );
	}

}
