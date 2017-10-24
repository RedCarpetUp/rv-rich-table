import React, { Component } from "react";
import { Route, Link, Switch } from "react-router-dom";
import { inject, observer } from "mobx-react";
import LazyRoute from "lazy-route";
import DevTools from "mobx-react-devtools";
import Profile from './Profile';

export default class Routes extends Component {

	render() {
		const { appState } = this.props;
		return (
			<div className="wrapper">
			<Switch>
				<Route exact path={"/"} component={({match}) => <Profile match={match} appState={appState}/>}/>
				<Route exact path={"/profiles/:page?/:sort?/:order?"} component={({match}) => <Profile match={match} appState={appState}/>}/>
			</Switch>
			</div>
		);
	}
}
