import React, {Component} from 'react';
import Header from './components/layout/Header';
import SideMenu from './components/profile/SideMenu';
import {inject, observer} from 'mobx-react';
import {Menu, Sidebar} from 'semantic-ui-react';
import {toJS} from 'mobx';
import history from './history';
import GridComponent from "./components/profile/GridComponent";
import {PROFILEDATA} from "./components/utils/constants";
import {fetchGithubUserData} from './api_endpoints/githubUser';

class Profile extends Component {

    state = {
        visible: false,
        userDetail: {
            name: '',
            avatar: ''
        },
        offline: false,
        initOfflineUI: false
    }

    componentDidMount() {
        // setInterval(() => {
        //     if (window.navigator.onLine) {
        //         this.setState({offline: false})
        //     } else {
        //         this.setState({offline: true, initOfflineUI: true})
        //     }
        // }, 1000);
        // fetch data from github api
        fetchGithubUserData().then(response => {
            const arr = response.data.items;
            if (arr.length === 0) {
                this.props.appState.tableList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
            } else {
                this.props.appState.tableList = arr;
            }
        })
    }

    toggleOverlay = e => {
        this.setState({
            visible: !this.state.visible
        })
    }

    handleShowDetail = (e) => {
        const {appState} = this.props;
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
    handlePageClick = e => {
        // call api to fetch the result and update the props
    };

    render() {
        const {appState, match} = this.props;
        // const tableList = appState.tableList;
        return (
            <div className="App">
                {this.state.offline &&
                <div
                    className="offline-ui offline-ui-down offline-ui-connecting offline-ui-reconnect-failed-2s offline-ui-reconnect-failed-5s">
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
                <h2 className="ui header" style={{paddingLeft: '20px'}}>
                    <i className="group icon"></i>
                    <div className="content">
                        <h3>PROFILE</h3>
                        <h2>Recent Profile List</h2>
                    </div>
                </h2>
                <div className="ui celled two column stackable grid">
                    <div className="row" style={{height: '500px'}}>
                        <div className="three wide column">
                            <SideMenu history={history} appState={appState}/>
                        </div>
                        <div className="thirteen wide column table-react" style={{padding: '0'}}>
                            <GridComponent
                                history={this.props.history}
                                columnWidths={PROFILEDATA.columnWidths}
                                columns={PROFILEDATA.columns}
                                columnName={PROFILEDATA.columnName}
                                tableList={this.props.appState.tableList}
                                handlePageClick={this.handlePageClick}
                                pageCount={1}
                                onShowDetailClick={this.handleShowDetail}
                            />
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
                        <img style={{width: '50px', margin: 'auto'}} src={this.state.userDetail.avatar}/>
                    </Menu.Item>
                    <Menu.Item name='camera'>
                        {this.state.userDetail.id}
                    </Menu.Item>
                </Sidebar>
                <div className="overlay" onClick={this.toggleOverlay}
                     style={this.state.visible ? {display: 'block'} : {display: 'none'}}></div>
            </div>
        );
    }
}

export default inject('appState')(observer(Profile));
