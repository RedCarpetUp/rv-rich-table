import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";
import Profile from './Profile';

export default class Routes extends Component {

    render() {
        return (
            <div className="wrapper">
                <Switch>
                    <Route exact path={"/"} component={(props) => <Profile {...props} />}/>
                    <Route exact path={"/profiles/:page?/:sort?/:order?"}
                           component={(props) => <Profile {...props} />}/>
                </Switch>
            </div>
        );
    }
}
