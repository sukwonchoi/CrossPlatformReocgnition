import React, { Component } from 'react';
import ApplicationBar from './ApplicationBar.jsx';
import Footer from './Footer.jsx';

// App component - represents the whole app

export default class App extends React.Component {

	componentDidMount(){
	}
  render () {
    return (
      <div>
      	<ApplicationBar/>
        {this.props.children}
        <Footer/>
      </div>
    )
  }
}

