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
    },
    offline: '',
    initOfflineUI: false
  }

  componentDidMount(){
    setInterval(() => {
      if(window.navigator.onLine){
        this.setState({offline:false})
      } else {
        this.setState({offline:true, initOfflineUI:true})
      }
    },1000)
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
        {this.state.offline &&
        <div className="offline-ui offline-ui-down offline-ui-connecting offline-ui-reconnect-failed-2s offline-ui-reconnect-failed-5s">
          <div className="offline-ui-content" data-retry-in-value="now" data-retry-in-unit=""></div>
          <a href="" className="offline-ui-retry"></a>
        </div>
        }
        {!this.state.offline && this.state.initOfflineUI &&
        <div className="offline-ui offline-ui-up offline-ui-up-5s">
          <div className="offline-ui-content" data-retry-in-value="now" data-retry-in-unit=""></div>
          <a href="" className="offline-ui-retry"></a>
        </div>
        }
        <Header/>
        <h2 className="ui header" style={{paddingLeft:'20px'}}>
          <i className="group icon"></i>
          <div className="content">
            <h3>PROFILE</h3>
            <h2>Recent Profile List</h2>
          </div>
        </h2>
        <div className="ui celled two column stackable grid">
          <div className="row" style={{height:'500px'}}>
            <div className="three wide column">
              <SideMenu history={history} appState={appState}/>
            </div>
            <div className="thirteen wide column table-react" style={{padding:'0'}}>
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
