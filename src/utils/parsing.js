import { toJS } from 'mobx'; 

const breakLine = "\n",
    tabulation = "\t"

export function excelClipboardToJson(clipboard) {
    try {
        let data = clipboard.split(breakLine)
        var clipboardJson =
            data.map((row, indexR) => row.split(tabulation)
                .map(value => isNaN(parseFloat(value)) ? "0" : value))
        clipboardJson.pop()// length - 1 because when you copy from excel, it put an extra row
        if (clipboardJson.length == 0 || (clipboardJson.length == 1 && clipboardJson[0].length == 1))
            return false
        return clipboardJson
    }
    catch (ex) {
        return false
    }
}

export function parseRow(rowIndex, list) {
    const data = toJS(list);
    const row = data[rowIndex];
    const columnsArr = [ "id", "avatar_url", "login", "followers_url", "task", "action" ];
    let string = ''
    columnsArr.map((idx) => {
        if (typeof row[idx] !== 'undefined') {
            string = string + row[idx] + "\t";
        }
    })
    return string;
}

export function parseClip(clipboard) {
    var rows = clipboard.split(String.fromCharCode(13));
    const arr = [];
    for(var row in rows) {
      var cells = rows[row].split("\t");
      arr.push(cells);
    }
    return arr
}

export function downloadCSV(list) {
    const data = toJS(list);
    let string = '';
    data.forEach((item, index) => {
      for (var prop in item) {
        if (item.hasOwnProperty(prop)) {
          string = string + item[prop] + ',';
          if (prop == 'score') {
            string = string + '\n'
          }
        }
      }
    });
    const encodedUri = encodeURI(string);
    window.open(encodedUri);
}