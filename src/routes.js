import React, {Component} from "react";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import Profile from './Profile';
import history from './history';

export default class Routes extends Component {

    render() {
        return (
            <div className="wrapper">
                <Router history={history}>
                    <Switch>
                         <Redirect exact path={"/"} to="/profiles"/>
                        <Route path={"/profiles"} component={(props) => <Profile {...props} />}/>
                        <Route exact path={"/profiles/:page?/:sort?/:order?"}
                               component={(props) => <Profile {...props} />}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}
