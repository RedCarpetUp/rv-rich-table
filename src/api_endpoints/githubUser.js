import * as axios from "axios";

function fetchGithubUserData(query = 'tom', page = 1, sort = 'followers', order = 'desc') {
    return axios({
        method: 'get',
        url: `https://api.github.com/search/users?q=${query}&page=${page}&sort=${sort}&order=${order}`,
    });
}

export {
    fetchGithubUserData
}