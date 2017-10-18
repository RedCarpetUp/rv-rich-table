import React, { Component } from 'react';
import ActiveLink from "../ui/ActiveLink";

class Header extends Component {

  render() {
    const path = window.location.pathname
    const {appState} = this.props;
    return (
      <div className="App">
        <div className="ui large menu" style={{marginBottom:0}}>
          <a className="active item">
            Logo
          </a>
          <div className="right menu">
            <div className="item">
              <i className="setting icon large" />
            </div>
            <div className="item">
              <i className="user circle large icon"/>
            </div>
          </div>
        </div>
        <div className="ui tabular menu" style={{marginTop:0}}>
          <ActiveLink to="/profiles">
          <span className={(path.indexOf('profiles') !== -1) ? 'item active' : 'item'}>
            Profiles
          </span>
          </ActiveLink>
        </div>
      </div>
    );
  }
}

export default Header;
