import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import ActionFlightTakeoff from 'material-ui/svg-icons/action/flight-takeoff';
import AvReplay from 'material-ui/svg-icons/av/replay';
import Undo from 'material-ui/svg-icons/content/undo';
import Redo from 'material-ui/svg-icons/content/redo';
import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import ImageColorLens from 'material-ui/svg-icons/image/color-lens';
import { SwatchesPicker } from 'react-color';

export default class Footer extends React.Component {
  constructor(){
    super();
    this.state = {
      displayColorPicker: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose() {
    console.log("handle close");
    this.setState({ displayColorPicker: false });
  };

  render() {
    var width = screen.width;
    var marginBottom = 60;
    const popover = {
      position: 'fixed',
      "background-color": 'red',
      bottom: '0',
      right: '0',
      zIndex: '2',
    }
    const cover = {
      position: 'relative',
      top: '0',
      right: '50px',
      bottom: '45px',
      left: '0',
    }
    const xd = {
      position:'fixed',
      left:0,
      width: width,
      height:'60px',
    }

    return (
      <div>
        <Tabs style={ xd }>
          <Tab icon={<Undo />} />
          <Tab icon={<Redo />} />
          <Tab icon={<ContentAddCircleOutline />} />

          <Tab className="basics" onActive={ this.handleClick } icon={<ImageColorLens />}>
            asdf
          </Tab>
        </Tabs>
      </div>
    );
  }
}