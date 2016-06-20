import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from '../imports/ui/App.jsx';
import MainMenu from '../imports/ui/MainMenu.jsx';
import Graphic from '../imports/ui/Graphic.jsx';
import Settings from '../imports/ui/Settings.jsx';


import { Router, Route, IndexRoute, browswerHistory } from 'react-router';

const router = (
	<Router history={ browswerHistory }>
		<Route path="/" component={ App }>
			<IndexRoute component={ MainMenu }></IndexRoute>
			<Route path="/game" component={ Graphic }></Route>
			<Route path="/settings" component={ Settings }></Route>
		</Route>
	</Router>
	)


Meteor.startup(() => {
  render(router, document.getElementById('render-target'));
});