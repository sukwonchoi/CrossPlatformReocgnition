import React, { Component } from 'react';
import ApplicationBar from './ApplicationBar.jsx'

// App component - represents the whole app

export const App = ( { children } ) => (

  <div className="ui container">
    { children }
  </div>
)

