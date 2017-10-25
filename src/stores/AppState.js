import { extendObservable, computed, toJS } from 'mobx';
import axios from 'axios';

class AppState {
  constructor() {
    extendObservable(this, {
      count: 1,
      tableList: [],
      isOdd: computed(() => this.count % 2 === 1),
      pageRange: 30,
      column: {
        avatar_url: 'ID',
        login: 'NAME',
        phone: 'PHONE',
        email: 'EMAIL',
        date_created: 'DATE CREATED',
        gender: 'GENDER',
        type: 'TYPE',
        tasks: 'TASKS',
        action: 'ACTION',
        score: 'SCORE'
      },
      newColumn: {
        repoId: 'REPO ID',
        repoName: 'REPO NAME',
        star: 'STAR',
        repoFullName: 'FULL NAME',
        dropdownRow: true
      },
      blankColumn: {
        blankColumn: true
      },
      columnsArr : [ " ", "id", "avatar_url", "login", "followers_url", "task", "action" ],
      pageCount: 0,
      query: 'tom',
      sort: '',
      order: '',
      page: '',
      dataTest: [{
          id:1,
          avatar_url: '',
          login: 'jeje'
        },{
          id:2,
          avatar_url: '',
          login: 'gege'
        }]
    });
  }

  getTableList(filter = {}) {
    const self = this;
    self.tableList = [];
    self.page = filter.page;
    let querystring = '';
    const qs = filter.qs;
    const name = qs.name || self.query;
    const repo = qs.repo || '';
    const lang = qs.lang || '';
    const repoqs = repo ? `repos:${repo}` : '';
    const langqs = lang ? `language:${lang}` : ''
    querystring = `${name}+${repoqs}+${langqs}`;
    console.log(name)
    if (filter.type !== '') {
      switch (filter.type) {
        // case 'name':
        //   self.query = filter.value
        //   break;
        // case 'repo':
        //   self.query = `repos:${filter.value}`
        //   break;
        // case 'followers':
        //   self.query = `followers:${filter.value}`
        //   break;
        case 'sort':
          self.sort = `followers`;
          self.order = filter.orderVal;
      }
    }

    axios({
      method:'get',
      url: `https://api.github.com/search/users?q=${querystring}&page=${self.page}&sort=${self.sort}&order=${self.order}`,
    })
    .then(function(response) {
      const arr = response.data.items;
      if(arr.length === 0){
        self.tableList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
      } else {
        self.tableList = arr;
      }
      //self.tableList = arr
      //arr.splice(0,0, self.column)
      
      self.pageCount = Math.abs(response.data.total_count/self.pageRange);
    });
  }

  updateDropdown(rowIndex, data){
    const arr = this.tableList;
    if (data) {
      arr.splice(rowIndex+1, 0, this.newColumn)
      this.tableList = arr;
      arr.splice(rowIndex+2, 0, this.blankColumn)
      this.tableList = arr;
      this.getRepoData(rowIndex)
    } else {
      // arr.splice(rowIndex+1, 1);
      // this.tableList = arr;
      this.removeRepoData(rowIndex)
    }
  }

  getRepoData(rowIndex){
    const url = this.tableList[rowIndex].repos_url;
    const self = this;
    const arr = toJS(this.tableList);
    axios({
      method:'get',
      url: url,
    })
    .then(function(response) {
      arr.splice(rowIndex+2, 1);
      self.tableList = arr;
      //arr.splice(rowIndex+2, 0, response.data)
      response.data.forEach((item, index) => {
        item.dropdownRow = true;
        item.dataRepo = true;
        arr.splice(rowIndex+2+index, 0, item)
      });
      self.tableList = arr;
    });
  }

  removeRepoData(rowIndex){
    const url = this.tableList[rowIndex].repos_url;
    const self = this;
    const arr = toJS(this.tableList);
    axios({
      method:'get',
      url: url,
    })
    .then(function(response) {
      response.data.forEach((item, index) => {
        arr.splice(rowIndex+1, 1);
      });
      arr.splice(rowIndex+1, 1);
      self.tableList = arr;
    });
  }

  updateTable(rowIndex, columnIndex, parsed){
    //const list = toJS(this.tableList);
    const arr = toJS(this.tableList);
    let countRow = rowIndex;
    parsed.map((row) => {
      let count = columnIndex;
      const rowArr = arr[countRow];
      row.map((cell) => {
        if(count == 1 || count == 2 || count == 3 || count == 4){
          rowArr[this.columnsArr[count]] = cell;
        }
        count++;
      })
      countRow++;
    }) 
    this.tableList = arr;
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}

export default AppState;
