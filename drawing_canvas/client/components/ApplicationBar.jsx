import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';

import TitleStore from '../stores/TitleStore.js';
import * as TitleActions from '../actions/TitleActions.js'

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'



export default class ApplicationBar extends Component{

  constructor(){
    super();
    this.state = {
      title: TitleStore.getTitle(),
      open: false,
    };

    this._toggle = this._toggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }


  componentWillMount(){
    TitleStore.on("change", () =>{
      this.setState({
        title: TitleStore.getTitle(),
      });
    })
  }

  titleHandler(title){
    console.log(title);
    TitleStore.setTitle(title);
    this.handleClose();
  }

  _toggle(e){
    e.preventDefault()
    this.setState({
      open: !this.state.open,
    })
  }

  handleClose() { this.setState({open: false}); }


render(){
  var menuItems = [
    { route: 'home', text: 'Home' },
    { route: 'about', text: 'About' },
  ];

  const appBarStyle = {
      position:'fixed',
  }

  return (
    <div>
      <AppBar
        style={appBarStyle}
        title={this.state.title}
        isInitiallyOpen={true} 
        onLeftIconButtonTouchTap={this._toggle} 
        onLeftIconButtonClick={this._toggle}
      />
    </div>
    );
    }
}