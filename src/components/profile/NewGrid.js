import React, { Component } from 'react';
import { ArrowKeyStepper, MultiGrid, Grid } from 'react-virtualized';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import Draggable from 'react-draggable';
import ReactPaginate from 'react-paginate';
import { Button, Header, Image, Modal, Form, 
  Checkbox, Sidebar, Segment, Menu, Icon, Message } from 'semantic-ui-react';
import { parseClip, parseRow } from '../../utils/parsing';
import queryString from 'query-string';
import ToolTip from 'react-portal-tooltip'


class TableApp extends Component {

  constructor() {
    super();
    //this.cellRendererBody = this.cellRendererBody.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);
    this.getColumnWidth = this.getColumnWidth.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.forceTableUpdate = this.forceTableUpdate.bind(this);
  }

  state = {
    tooltip: 'none',
    tooltipText: '',
    offsetX: 0,
    offsetY: 0,
    isClickable: true,
    isSortDown: '',
    mode: "cells",
    scrollToColumn: 0,
    scrollToRow: 0,
    columnWidth: 100,
    columnWidth2: 100,
    minColWidth: 20,
    sortBy: '',
    order: '',
    page: 0,
    columnWidths: [50, 140, 100, 150, 320, 170, 230],
    columns : [ "select", "id", "avatar_url", "login", "followers_url", "task", "action" ],
    columnName: [ " ", "Id", "Avatar", "Name", "Followers", "Task", "Action"]
  }

  componentWillMount(){
    const { appState, match } = this.props;
    const sortBy = match.params.sort;
    const orderBy = match.params.order || 'asc';
    if(sortBy === 'followers') {
      this.handleSortData(3, orderBy)
    }     
  }

  componentWillUnmount() {
    this.setState({
      sortBy: ''
    })
  }

  onDrag(index, e, ui) {
    const newColumnWidths = [...this.state.columnWidths];

    newColumnWidths[index] = Math.max(
    this.state.columnWidths[index] + (ui.deltaX), this.state.minColWidth);
    this.setState({
      columnWidths: newColumnWidths,
    });

    this.forceTableUpdate();
  }

  getColumnWidth = ({ index = 0 }) => {
    return this.state.columnWidths[index];
  }

  // getRowHeight = ({ index = 0 }) => {
  //   if (index == 0){
  //     return 40
  //   }
  //   return 30
  // }

  forceTableUpdate() {
    //this.bodyGrid.recomputeGridSize({ columnIndex: 0, rowIndex: 0 });
    this.grid.recomputeGridSize({ columnIndex: 0, rowIndex: 0 });
    this.header.recomputeGridSize({ columnIndex: 0, rowIndex: 0 });
    //this.leftHeader.recomputeGridSize({ columnIndex: 0, rowIndex: 0 });
  }

  handleEdit = (rowIndex, e) => {
    const { appState } = this.props;
    const tableList = appState.tableList;
    const prevName = tableList[rowIndex].login;
    this.setState({
      [`cell-input-${rowIndex}`] : true,
      [`edit-${rowIndex}`] : true,
      [`cell-edit-${rowIndex}-2`] : this.state[`cell-edit-${rowIndex}-2`] || prevName
    })
  }

  handlChange = (rowIndex, columnIndex, e) => {
    this.setState({
      [`cell-edit-${rowIndex}-${columnIndex}`]: e.target.value
    })
  }

  handleSave = (rowIndex, e) => {
    const { appState } = this.props;
    const tableList = appState.tableList;
    // const prevName = tableList[rowIndex].login;
    // if (prevName != this.state[`cell-edit-${rowIndex}-2`]) {
    //   const node = document.getElementById(`cell-edit-${rowIndex}-2`);
    //   node.parentNode.parentNode.style.background = 'red'
    // }
    this.setState({
      [`cell-input-${rowIndex}`] : false,
      [`edit-${rowIndex}`] : false
    })
  }

  handleClickShowDetails = (rowIndex, e) => {
    this.props.onShowDetailClick({
      rowIndex: rowIndex
    })
  }

  handleDelete = e => {

  }

  handleSortData = (columnIndex, orderBy) => {
    const { appState } = this.props;
    if (orderBy === 'asc') {
      this.setState({
        [`head-${columnIndex}`]: 'false'
      })
      //appState.getTableList({type: 'sort', sortVal: this.state.columns[columnIndex], orderVal: orderBy});
    } else {
      for (var i = 6; i >= 0; i--) {
        this.setState({
          [`head-${i}`]: ''
        }) 
      }
      this.setState({
        [`head-${columnIndex}`]: 'true'
      })
      //appState.getTableList({type: 'sort', sortVal: this.state.columns[columnIndex], orderVal: orderBy});
    }
  }

  handlHeaderClick = (columnIndex,e) => {
    const { appState, history, match } = this.props;
    const qs = window.location.search;
    const parsed = queryString.parse(qs);

    if(this.state[`head-${columnIndex}`] == 'true') {
      // sort up
      this.setState({
        [`head-${columnIndex}`]: 'false',
        sortBy: 'followers',
        order: 'asc'
      })
      history.push(`/profiles/${this.state.page}/followers/asc${qs}`)
      appState.getTableList({type: 'sort', page:this.state.page , 
        sortVal: this.state.columns[columnIndex], 
        orderVal:'asc',
        qs: parsed
      });
    } else {
      // sort down
      for (var i = 6; i >= 0; i--) {
        this.setState({
          [`head-${i}`]: ''
        }) 
      }
      this.setState({
        [`head-${columnIndex}`]: 'true',
        sortBy: 'followers',
        order: 'desc'
      })
      history.push(`/profiles/${this.state.page}/followers/desc${qs}`)
      appState.getTableList({type: 'sort', page:this.state.page , 
        sortVal: this.state.columns[columnIndex], 
        orderVal:'desc',
        qs: parsed
      });
    }
    
  }

  headerCellRenderer(scrollToColumn, scrollToRow, { columnIndex, key, rowIndex, style}) {
    const bgHeader = (columnIndex === scrollToColumn) ? '#eaeaea' : 'rgb(250, 250, 250)';
    const isSortDown = this.state[`head-${columnIndex}`];
    //const isSortDown = this.state.isSortDown;

    return (
      <div
        className="header-container"
        key={key}
        style={{
          ...style,
          position: 'fixed',
          background: bgHeader,
        }}
      >
        
        <div
          onClick={(columnIndex == 3) ? this.handlHeaderClick.bind(this, columnIndex): () => {}}
          className="header-cell"
          style={{
            borderBottom: '1px solid rgb(224, 224, 224)',
            //borderLeft: (columnIndex == 0) ? '1px solid rgb(224, 224, 224)' : '',
            lineHeight: '2.8',
            fontWeight: 'bold',
            float:'left',
            width: 'calc(100% - 4px)',
            height: '40px',
            paddingLeft: '5px'
          }}
        >
          {
            this.state.columnName[columnIndex]
          }
          {columnIndex == 3 &&
            <i aria-hidden="true" className="sort icon"></i>
          }
          {isSortDown == 'true' &&
          <i aria-hidden="true" className="chevron down icon"></i>
          }
          {isSortDown == 'false' &&
          <i aria-hidden="true" className="chevron up icon"></i>
          }
          
        </div>
        <Draggable
          axis="x"
          onDrag={this.onDrag.bind(this, columnIndex)}
          position={{ x: 0, y: 0 }}
        >
          <div
            className="column-sizer"
            style={{
              float:'right',
              backgroundColor: 'transparent',
              //borderTop: '1px solid rgb(224, 224, 224)',
              borderRight: `1px solid rgb(224, 224, 224)`,
              borderBottom: `1px solid rgb(224, 224, 224)`,
            }}
          >
          </div>
        </Draggable>
      </div>
    )
  }

  handlePaste = (rowIndex, columnIndex, e) => {
    const { appState } = this.props;
    const parsed = parseClip(e.clipboardData.getData('text/plain'));
    appState.updateTable(rowIndex, columnIndex, parsed)
  }

  handleCopy = (rowIndex, e) => {
    const { appState } = this.props;
    const list = appState.tableList;
    const parsed = parseRow(rowIndex, list);
    e.clipboardData.setData('text/plain', parsed);
    e.preventDefault();
    document.execCommand('copy');
  }

  handleCopyCell = (rowIndex, columnIndex, e) => {
    const { appState } = this.props;
    const tableList = appState.tableList;
    const string = tableList[rowIndex][this.state.columns[columnIndex]];
    e.clipboardData.setData('text/plain', string);
    e.preventDefault();
    document.execCommand('copy');
  }

  handleClickId = (rowIndex, e) => {
    const { appState } = this.props;
    appState.updateDropdown(rowIndex, true);
    this.setState({
      [`row-click-${rowIndex}`]: true
    })
  }

  handleClickId2 = (rowIndex, e) => {
    const { appState } = this.props;
    appState.updateDropdown(rowIndex, false);
    this.setState({
      [`row-click-${rowIndex}`]: false
    })
  }

  handleSelectClick = (rowIndex, e) => {
    for (var i = 30; i >= 0; i--) {
      this.setState({
        [`s-${i}`]: false
      }) 
    }
    this.setState({
      [`s-${rowIndex}`] : true
    })
  }

  handleTooltip = (data, e) => {
    const bodyRect = document.getElementById('table-cont').getBoundingClientRect()
    const elemRect = e.target.getBoundingClientRect();
    const offsetY   = elemRect.top - bodyRect.top;
    const offsetX   = elemRect.left - bodyRect.left;
    console.log(offsetX, offsetY)
    this.setState({
      tooltip: 'block',
      offsetY: offsetY - 54,
      offsetX: offsetX,
      tooltipText: data
    })
  }

  handleTooltip2 = e => {
    this.setState({
      tooltip: 'block'
    })
  }

  handleTooltipOut = e => {
    this.setState({
      tooltip: 'none'
    })
  }

  cellRenderer(scrollToColumn, scrollToRow, { columnIndex, key, rowIndex, style}) {
    const { appState } = this.props;
    const { isClickable, mode, columns } = this.state;
    const tableList = appState.tableList;
    const columnName = this.state.columnName[columnIndex];

    let bgBody = '';
    if (rowIndex % 2 == 0) {
      if (columnIndex % 2 == 0) {
        bgBody = 'rgb(250, 250, 250)'
      }
    } else {
      if (columnIndex % 2 == 0) {
        bgBody = ''
      } else {
        bgBody = 'rgb(250, 250, 250)'
      }
    }

    const sRow = this.state[`s-${rowIndex}`] || false;
    const idRow = this.state[`cell-input-${rowIndex}`] || false;
    const isClick = this.state[`cell-name-${rowIndex}`] || false;
    const isEdit = this.state[`edit-${rowIndex}`] || false;
    const borderClick = this.state[`border-${rowIndex}-${columnIndex}`] || 'cel-div';
    const bgHeader = (columnIndex === scrollToColumn) ? '#eaeaea' : 'rgb(250, 250, 250)';
    const className = (columnIndex === scrollToColumn && rowIndex === scrollToRow) ? 'border-click' : 'cel-div'
    const rowClicked = this.state[`row-click-${rowIndex}`] || false;
    let hgbg = '';
    if (scrollToColumn == 0) {
      hgbg = (sRow) ? 'hgbg' : '';
    } else {
      hgbg = '';
    }
    const show = (columnIndex === scrollToColumn && rowIndex === scrollToRow) ? true : false;

    return (
      <div>
      <div key={key}>
          <div
            className={className}
            
            // onFocus={this.handleClickCell.bind(this, rowIndex, columnIndex)}
            // onBlur={this.handleBlurCell.bind(this, rowIndex, columnIndex)}
            // tabIndex="-1"
            onClick={
              this.state.isClickable &&
              (() =>
                this._selectCell({
                  scrollToColumn: columnIndex,
                  scrollToRow: rowIndex
                }))
            }
            onPaste={this.handlePaste.bind(this, rowIndex, columnIndex)}
            data-column={columnIndex}
            data-row={rowIndex}
            style={{
              ...style,
              lineHeight: '2.2',
              textAlign: 'right',
              background: bgBody,
              overflow: 'hidden',
              //borderLeft: (columnIndex == 0) ? '1px solid rgb(224, 224, 224)' : ''
            }}

          >

            
            {columnName == ' ' &&
              <div onClick={this.handleSelectClick.bind(this, rowIndex)} onCopy={this.handleCopy.bind(this, rowIndex)} className="cell-div22">
                <span>{rowIndex + 1}</span>
              </div>
            }
            {columnName == 'Id' &&
              <div onMouseEnter={this.handleTooltip.bind(this, tableList[rowIndex][this.state.columns[columnIndex]])}
            onMouseLeave={this.handleTooltipOut} onCopy={this.handleCopyCell.bind(this, rowIndex, columnIndex)} className={hgbg}>

                {!tableList[rowIndex]['dropdownRow'] && !tableList[rowIndex]['blankColumn'] && typeof tableList[rowIndex] === 'object' &&
                  <div style={{textAlign:'left'}}
                  className="cell-div2">
                  {!rowClicked &&
                  <i onClick={this.handleClickId.bind(this, rowIndex)} className="icon caret right" />
                  }
                  {rowClicked &&
                  <i onClick={this.handleClickId2.bind(this, rowIndex)} className="icon caret down" />
                  }
                  <span>{tableList[rowIndex][this.state.columns[columnIndex]]}</span>
                  </div>
                }
                {tableList[rowIndex]['repoId'] &&
                  <div className="cell-div22">
                  <span style={{fontWeight:'bold'}}>{tableList[rowIndex]['repoId']}</span>
                  </div>
                }
                {tableList[rowIndex]['blankColumn'] &&
                  <div id="fountainG2" style={{marginTop:'8px'}}>
                    <div id="fountainG_1" className="fountainG2"></div>
                    <div id="fountainG_2" className="fountainG2"></div>
                    <div id="fountainG_3" className="fountainG2"></div>
                    <div id="fountainG_4" className="fountainG2"></div>
                    <div id="fountainG_5" className="fountainG2"></div>
                    <div id="fountainG_6" className="fountainG2"></div>
                    <div id="fountainG_7" className="fountainG2"></div>
                    <div id="fountainG_8" className="fountainG2"></div>
                  </div>
                }
                {tableList[rowIndex]['dataRepo'] &&
                  <div className="cell-div22">
                  <span>{tableList[rowIndex]['id']}</span>
                  </div>
                }
              </div>
            }
            {columnName == 'Avatar' &&
              <div onCopy={this.handleCopyCell.bind(this, rowIndex, columnIndex)} className={hgbg}>
               {!tableList[rowIndex]['dropdownRow'] &&
                <img 
                style={{marginTop:'2px', width:'25px'}}
                src={tableList[rowIndex][this.state.columns[columnIndex]]} />
               }
                {tableList[rowIndex]['repoName'] &&
                <div className="cell-div22">
                <span style={{fontWeight:'bold'}}>{tableList[rowIndex]['repoName']}</span>
                </div>
                }
                {tableList[rowIndex]['dataRepo'] &&
                  <div className="cell-div22">
                  <span>{tableList[rowIndex]['name']}</span>
                  </div>
                }
              </div>
            }
            {columnName == 'Name' &&
              <div onMouseEnter={this.handleTooltip.bind(this, this.state[`cell-edit-${rowIndex}-${columnIndex}`] || tableList[rowIndex][this.state.columns[columnIndex]]) }

            onMouseLeave={this.handleTooltipOut} className={'cell-div2 ' + hgbg} style={{paddingTop:'4px'}} onCopy={this.handleCopyCell.bind(this, rowIndex, columnIndex)}>
              {idRow &&
              <div id={`cell-edit-${rowIndex}-${columnIndex}`} className={isClick ? 'cell-wrap active-cell' : 'cell-wrap'}>
                <input className="editing-cell" type="text" defaultValue={tableList[rowIndex][this.state.columns[columnIndex]]} 
                value={this.state[`cell-edit-${rowIndex}-${columnIndex}`]} onChange={this.handlChange.bind(this, rowIndex, columnIndex)}/>
              </div>
              }
              {!idRow &&
                <span>{this.state[`cell-edit-${rowIndex}-${columnIndex}`] || tableList[rowIndex][this.state.columns[columnIndex]]}</span>
              }
              {tableList[rowIndex]['repoName'] &&
                <div className="cell-div22">
                <span style={{fontWeight:'bold'}}>{tableList[rowIndex]['star']}</span>
                </div>
                }
              {tableList[rowIndex]['dataRepo'] &&
                  <div className="cell-div22">
                  <span>{tableList[rowIndex]['stargazers_count']}</span>
                  </div>
                }
              </div>
            }
            {columnName == 'Followers' &&
              <div onMouseEnter={this.handleTooltip.bind(this, tableList[rowIndex][this.state.columns[columnIndex]]) }

            onMouseLeave={this.handleTooltipOut} className={'cell-div2 ' + hgbg} style={{paddingTop:'4px'}} onCopy={this.handleCopyCell.bind(this, rowIndex, columnIndex)}>
              <span>{tableList[rowIndex][this.state.columns[columnIndex]]}</span>
              </div>
            }
            {columnName == 'Task' &&
              <div className={'cell-div2 ' + hgbg}>
              {!tableList[rowIndex]['dropdownRow'] && typeof tableList[rowIndex] === 'object' &&
                <Modal trigger={<Button className="create-app-btn">
                  Create Application
                </Button>}>
                  <Modal.Header>Form</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.Field>
                        <label>First Name</label>
                        <input placeholder='First Name' />
                      </Form.Field>
                      <Form.Field>
                        <label>Last Name</label>
                        <input placeholder='Last Name' />
                      </Form.Field>
                      <Form.Field>
                        <Checkbox label='I agree to the Terms and Conditions' />
                      </Form.Field>
                      <Button type='submit'>Submit</Button>
                    </Form>
                  </Modal.Content>
              </Modal>
              }
              </div>
            }
            {columnName == 'Action' && typeof tableList[rowIndex] === 'object' &&
              <div className={'cell-div2 ' + hgbg}>
              {!tableList[rowIndex]['dropdownRow'] &&
              <div>
              {isEdit &&
                <Button className="cell-save"
                 onClick={this.handleSave.bind(this, rowIndex)}>
                  <i className="icon check" />
                </Button>
              }
              {!isEdit &&
              <Button className="cell-edit" 
                style={{margin:'10px'}}
                onClick={this.handleEdit.bind(this, rowIndex)}>
                <i className="icon pencil" />
              </Button>
              }
              <Button className="cell-delete" 
               onClick={this.handleDelete.bind(this, rowIndex)}>
                <i className="icon delete" />
              </Button>
              <Button className="create-app-btn" onClick={this.handleClickShowDetails.bind(this, rowIndex)}>
                  Show Details
              </Button>
              </div>
              }
              </div>
            }
      </div>
      </div>
      </div>
    );
  }

  _selectCell = ({ scrollToColumn, scrollToRow }) => {
    this.setState({ scrollToColumn, scrollToRow });
  };

  _noRowsRenderer = e => {
    return (
      <div style={{marginTop:'40px'}}>
        <div id="fountainG" style={{width:'260px'}}>
          <div id="fountainG_1" className="fountainG"></div>
          <div id="fountainG_2" className="fountainG"></div>
          <div id="fountainG_3" className="fountainG"></div>
          <div id="fountainG_4" className="fountainG"></div>
          <div id="fountainG_5" className="fountainG"></div>
          <div id="fountainG_6" className="fountainG"></div>
          <div id="fountainG_7" className="fountainG"></div>
          <div id="fountainG_8" className="fountainG"></div>
        </div>
      </div>
    )
  }

  handlePageClick = e => {
    const { appState, history, match } = this.props;
    const page = (isNaN(e.selected)) ? 0 : e.selected;
    const qs = window.location.search;
    const parsed = queryString.parse(qs);
    if (this.state.sortBy == ''){
      if (match.params.sort == 'followers'){
        history.push(`/profiles/${page + 1}/${match.params.sort}/${match.params.order}${qs}`)
        appState.getTableList({page: page + 1, type: 'sort', orderVal:match.params.order, qs: parsed}); 
      } else {
        history.push(`/profiles/${page + 1}${qs}`)
        appState.getTableList({page: page + 1, qs: parsed}); 
      }
    } else {
      history.push(`/profiles/${page + 1}/${this.state.sortBy}/${this.state.order}${qs}`)
      appState.getTableList({page: page + 1, type: 'sort', orderVal:this.state.order, qs: parsed}); 
    }
    this.setState({page: page + 1})

  }


  render() {
    const { appState, match } = this.props;
    const { isClickable, mode, scrollToColumn, scrollToRow, columns  } = this.state;
    const tableList = appState.tableList;
    return (
      <div className="table-cont" id="table-cont">
        <ArrowKeyStepper
          columnCount={columns.length}
          key={isClickable}
          isControlled={isClickable}
          onScrollToChange={isClickable ? this._selectCell : undefined}
          mode={mode}
          rowCount={tableList.length}
          scrollToColumn={scrollToColumn}
          scrollToRow={scrollToRow}
        >
          {({ onSectionRendered, scrollToColumn, scrollToRow }) =>
          <div>
          <Grid
          ref={(input) => { this.header = input; }}
          cellRenderer={this.headerCellRenderer.bind(this, scrollToColumn, scrollToRow)}
          className="HeaderGrid"
          style={{
            outline: 'none',
            overflow: 'hidden',
          }}
          width={1200}
          height={40}
          rowHeight={40}
          columnWidth={this.getColumnWidth}
          rowCount={1}
          columnCount={columns.length}
        />
         <Grid
          ref={(input) => { this.grid = input; }}
          cellRenderer={this.cellRenderer.bind(this, scrollToColumn, scrollToRow)}
          style={{
            outline: 'none',
          }}
          width={1200}
          height={460}
          rowHeight={30}
          columnWidth={this.getColumnWidth}
          rowCount={tableList.length}
          noContentRenderer={this._noRowsRenderer}
          columnCount={columns.length}
          scrollToColumn={scrollToColumn}
          scrollToRow={scrollToRow}
          onSectionRendered={onSectionRendered}
        />
        </div>
        }
        </ArrowKeyStepper>
        <div id="react-paginate">
        <ReactPaginate previousLabel={"<"}
           nextLabel={">"}
           breakLabel={<a href="">...</a>}
           breakClassName={"break-me"}
           pageCount={appState.pageCount}
           marginPagesDisplayed={2}
           pageRangeDisplayed={30}
           initialPage={parseInt(match.params.page)-1}
           onPageChange={this.handlePageClick}
           containerClassName={"pagination"}
           subContainerClassName={"pages pagination"}
           activeClassName={"active"} />
        </div>
        <Message className="tooltip" floating onMouseEnter={this.handleTooltip2} onMouseLeave={this.handleTooltipOut}
          style={{
            display: this.state.tooltip,
            left: this.state.offsetX,
            top: this.state.offsetY
          }}
        >
          {this.state.tooltipText}
        </Message>
      </div>
    );
  }
}

export default observer(TableApp);
