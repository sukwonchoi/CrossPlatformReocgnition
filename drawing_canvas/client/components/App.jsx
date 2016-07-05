import React, { Component } from 'react';
import ApplicationBar from './ApplicationBar.jsx'

// App component - represents the whole app

export default class App extends React.Component {

	componentDidMount(){
		window.children = this.props.children;
	}
  render () {
    return (
      <div>
      	<ApplicationBar/>
        {this.props.children}
      </div>
    )
  }
}

