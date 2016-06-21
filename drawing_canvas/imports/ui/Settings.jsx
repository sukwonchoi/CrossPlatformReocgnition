import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';


export default class Settings extends Component{

	constructor(){
		super();

	}

	componentDidMount(){
		$('.ui.radio.checkbox').checkbox();

	}
	
	render(){
	    return (
	    	<div className="ui container">
					<h2 className="ui dividing header">
					  Ink Color
					</h2>
	    		<div className="ui form">
			    	<div className="grouped fields">
			    		<div className="ui field">
	 	 	  				<div className="ui radio checkbox">
	 	   						<input type="radio" name="color" checked="" tabindex="0" class="hidden"/>
 	   							<label>Black</label>
								</div>
			    		</div>
			    		<div className="ui field">
		  	  			<div className="ui radio checkbox">
		    						<input type="radio" name="color" checked="" tabindex="0" class="hidden"/>
 	 	  							<label color="blue">Blue</label>
								</div>
			    		</div>
			    		<div className="ui field">
		  	  			<div className="ui radio checkbox">
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
								<div className="ui toggle read-only checkbox">
		 		 					<input type="checkbox" checked="checked" name="public" />
		  						<label>X</label>
								</div>
							</div>
							<div className="ui field">
								<div className="ui toggle read-only checkbox">
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