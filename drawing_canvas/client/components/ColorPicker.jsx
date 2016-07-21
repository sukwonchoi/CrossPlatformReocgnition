import React, { Component } from 'react';
import { CustomPicker } from 'react-color';

class ColorPicker extends Component{

	constructor(){
		super()
	}

	render(){
		return(<div>MyColorPicker</div>);
	}
}

export default CustomPicker(ColorPicker);