import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';


export default class MainMenu extends Component{

	constructor(){
		super();
	}
	
	render(){
	    return (
	      <div>
	      	  <ul>
	    		<li><Link to="/game" activeClassName="active">Play</Link></li>
	    		<li><Link to="/settings" activeClassName="active">Options</Link></li>
  			  </ul>
	      </div>
	    );
	}

}
