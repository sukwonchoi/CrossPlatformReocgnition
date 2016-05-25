import React, { Component } from 'react';

import Graphic from './Graphic.jsx';

export default class Sketchpad extends Component {
    render(){
        return(
        <div>
            <div id="sketchpadapp">
                <div className="leftside"></div>
                <div className="rightside">
                    <Graphic />
                    
                </div>
            </div>
        </div>
        );
    }
}
