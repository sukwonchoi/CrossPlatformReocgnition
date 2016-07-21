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
      <Drawer
        docked={false}
        open={this.state.open}>
        <MenuItem linkButton containerElement={<Link to="/game" />} onTouchTap={() => this.titleHandler("Tic Tac Toe")} primaryText="Tic Tac Toe" />
        <MenuItem linkButton containerElement={<Link to="/graph" />} onTouchTap={() => this.titleHandler("Swag")} primaryText="NEW STUFF" />
      </Drawer>
      <AppBar
        style={appBarStyle}
        title={this.state.title}
        isInitiallyOpen={true} 
        onLeftIconButtonTouchTap={this._toggle} 
        onLeftIconButtonClick={this._toggle}
        iconElementRight={
          <IconMenu 
             iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
             targetOrigin={{horizontal: 'right', vertical: 'top'}} 
             anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
            <MenuItem primaryText="Refresh" />
            <MenuItem linkButton containerElement={<Link to="/settings" />} onTouchTap={() => this.titleHandler("Settings")} primaryText="Settings" />
          </IconMenu>
        }
      />
      <Drawer ref="leftNav" docked={false} menuItems={menuItems} />
    </div>
    );
    }
}