import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from './components/App.jsx';
import MainMenu from './components/MainMenu.jsx';
import Graph from './components/Graph.jsx'
import Graphic from './components/Graphic.jsx';
import Settings from './components/Settings.jsx';


import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Router, Route, IndexRoute, browswerHistory } from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const router = (
	<MuiThemeProvider>
				<Router history={ browswerHistory }>
					<Route path="/" component={ App }>
						<IndexRoute component={ MainMenu }></IndexRoute>
						<Route name="Tic Tac Toe" path="/game" component={ Graphic }></Route>
						<Route name="Settings" path="/settings" component={ Settings }></Route>
						<Route name="Graph" path="/graph" component = { Graph }></Route>
					</Route>
				</Router>
	</MuiThemeProvider>
	)


Meteor.startup(() => {
  render(router, document.getElementById('render-target'));
});