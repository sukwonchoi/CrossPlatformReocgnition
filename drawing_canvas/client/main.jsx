import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from '../imports/ui/App.jsx';

import { Router, Route, IndexRoute, BrowserHistory } from 'react-router';

const router = (
	<Router history={BrowserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={App}></IndexRoute>
			<Route></Route>

		</Route>

	</Router>
	)

Meteor.startup(() => {
  render(router, document.getElementById('render-target'));
});