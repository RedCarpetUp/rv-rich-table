import React, { Component } from 'react';
import Select from 'react-virtualized-select'
import createFilterOptions from 'react-select-fast-filter-options';
import { Dropdown, Icon, Input, Menu } from 'semantic-ui-react'

import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

import { downloadCSV } from '../../utils/parsing';

class SideMenu extends Component {

  state = {
    selectValue: '',
    options: [
      { label: "> 10 Repos", value: 10 },
      { label: "> 50 Repos", value: 50 },
      { label: "> 100 Repos", value: 100 }
      // And so on...
    ],
    options2: [
      { label: "> 100 Followers", value: 100 },
      { label: "> 500 Followers", value: 500 },
      { label: "> 1000 Followers", value: 1000 }
      // And so on...
    ],
    fieldOption: [
      { label: "Name", value: 'login' },
      { label: "Id", value: 'id' },
      { label: "Avatar", value: 'avatar_url' },
      { label: "Followers", value: 'followers_url' },
      { label: "Type", value: 'type' },
      { label: "Score", value: 'score' },
    ]
  }

  handleSearchName = e => {
    this.setState({
      search: e.target.value
    })
  }

  handleKeyPress = e => {
    const {appState} = this.props;
    if (e.key === 'Enter') {
      appState.getTableList({type: 'name', value: this.state.search});
    }
  }

  handleChangeSelect = (selectValue) => {
    const {appState} = this.props;
    this.setState({ 
      selectValue 
    })
    appState.getTableList({type: 'repo', value: selectValue.value});
  }

  handleChangeSelect2 = (selectValue2) => {
    const {appState} = this.props;
    this.setState({ 
      selectValue2 
    })
    appState.getTableList({type: 'followers', value: selectValue2.value});
  }

  handleExportCSV = e => {
    const {appState} = this.props;
    downloadCSV(appState.tableList);
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleChangeSub = (selectSub) => {
    this.setState({
      selectSub
    })
  }

  render() {
    const { activeItem } = this.state

    const {appState} = this.props;
    return (
      <div className="ui vertical menu">
          {/*<Menu.Item>
            <button onClick={this.handleExportCSV} className="ui button" role="button">Export CSV</button>
          </Menu.Item>*/}
          {/*<Menu.Item>
            <Select
              options={this.state.fieldOption}
              onChange={this.handleChangeSub}
              value={this.state.selectSub}
              placeholder="Sub Dimensions"
            />
          </Menu.Item>*/}
          <Menu.Item>
            <Input placeholder='Search name...' onChange={this.handleSearchName} 
            value={this.state.search} onKeyPress={this.handleKeyPress} />
          </Menu.Item>
          <Menu.Item>
            <Select
              options={this.state.options}
              onChange={this.handleChangeSelect}
              value={this.state.selectValue}
              placeholder="Repository"
            />
          </Menu.Item>
          <Menu.Item>
            <Select
              options={this.state.options2}
              onChange={this.handleChangeSelect2}
              value={this.state.selectValue2}
              placeholder="Followers"
            />
          </Menu.Item>

        <Dropdown item text='More'>
          <Dropdown.Menu>
            <Dropdown.Item icon='edit' text='Edit Profile' />
            <Dropdown.Item icon='globe' text='Choose Language' />
            <Dropdown.Item icon='settings' text='Account Settings' />
          </Dropdown.Menu>
        </Dropdown>
        </div>
    );
  }
}

export default SideMenu;
