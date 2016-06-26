import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';

import TitleStore from '../../client/stores/TitleStore.js';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';


export default class ApplicationBar extends Component{

  constructor(){
    super();
    this.state = {
      title: TitleStore.getTitle(),
    };
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
  }

render(){
  return (
      <AppBar
        title={this.state.title}
        iconElementRight={
          <IconMenu 
             iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
             targetOrigin={{horizontal: 'right', vertical: 'top'}} 
             anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
            <MenuItem primaryText="Refresh" />
            <MenuItem linkButton containerElement={<Link to="/game" />} onTouchTap={() => this.titleHandler("Tic Tac Toe")} primaryText="Tic Tac Toe" />
            <MenuItem linkButton containerElement={<Link to="/graph" />} onTouchTap={() => this.titleHandler("Swag")} primaryText="NEW STUFF" />
            <MenuItem linkButton containerElement={<Link to="/settings" />} onTouchTap={() => this.titleHandler("Settings")} primaryText="Settings" />
          </IconMenu>
        }
      />
    );
    }
}