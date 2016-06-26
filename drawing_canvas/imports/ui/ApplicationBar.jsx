import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';


import { IndexLink, Link } from 'react-router';



export default class ApplicationBar extends Component{

render(){
  return (
      <AppBar
        title="Tic Tac Toe"
        iconElementRight={
          <IconMenu 
             iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
             targetOrigin={{horizontal: 'right', vertical: 'top'}} 
             anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
            <MenuItem primaryText="Refresh" />
            <MenuItem linkButton containerElement={<Link to="/settings" />} primaryText="Settings" />
            <MenuItem linkButton containerElement={<Link to="/graph" />} primaryText="NEW STUFF" />
          </IconMenu>
        }
      />
    );
    }
}