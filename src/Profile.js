import React, { Component } from 'react';
import Header from './components/layout/Header';
import SideMenu from './components/profile/SideMenu';
import { observer } from 'mobx-react';
import { Route, Link } from "react-router-dom";
import TableApp from './components/profile/NewGrid';
import { Sidebar, Segment, Button, Menu, Image, Icon } from 'semantic-ui-react';
import { toJS } from 'mobx';
import history from './history';

class Profile extends Component {

  state = { 
    visible: false,
    userDetail: {
      name: '',
      avatar: ''
    }
  }

  toggleOverlay = e => {
    this.setState({
      visible: !this.state.visible
    })
  }

  handleShowDetail = (e) => {
    const { appState } = this.props;
    const tableList = appState.tableList;
    const tableListJs = toJS(tableList);
    this.setState({ 
      visible: !this.state.visible,
      userDetail: {
        name: tableListJs[e.rowIndex].login,
        avatar: tableListJs[e.rowIndex].avatar_url,
        id: tableListJs[e.rowIndex].id
      }
    })
  }

  render() {
    const { appState, match } = this.props;
    const tableList = appState.tableList;

    return (
      <div className="App">
        <Header/>
        
        <h2 className="ui header" style={{paddingLeft:'20px'}}>
          <i className="group icon"></i>
          <div className="content">
            <h3>PROFILE</h3>
            <h2>Recent Profile List</h2>
          </div>
        </h2>
        <div className="ui celled grid">
          <div className="row" style={{height:'500px'}}>
            <div className="three wide column">
              <SideMenu appState={appState}/>
            </div>
            <div className="thirteen wide column" style={{padding:'0'}}>
             <TableApp history={history} match={match} appState={appState} onShowDetailClick={this.handleShowDetail} />
            </div>
          </div>
      </div>
          <Sidebar
            as={Menu}
            animation='overlay'
            width='wide'
            direction='right'
            visible={this.state.visible}
            icon='labeled'
            vertical
          >
            <Menu.Item name='home'>
              {this.state.userDetail.name}
            </Menu.Item>
            <Menu.Item name='gamepad'>
              <img style={{width:'50px',margin:'auto'}} src={this.state.userDetail.avatar} />
            </Menu.Item>
            <Menu.Item name='camera'>
              {this.state.userDetail.id}
            </Menu.Item>
          </Sidebar>
           <div className="overlay" onClick={this.toggleOverlay} style={this.state.visible ? {display:'block'} : {display:'none'}}></div>
      </div>
    );
  }
}

export default observer(Profile);
