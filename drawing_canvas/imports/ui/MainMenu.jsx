import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';

import AppBar from 'material-ui/AppBar';
import ApplicationBar from './ApplicationBar.jsx'
import Graphic from './Graphic.jsx';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


export default class MainMenu extends Component{

	constructor(){
		super();
	}

	render(){
	    return (
	      <div>
	      	
   	<ApplicationBar />
	      	<Graphic />

	      </div>
	    );
	}
}
