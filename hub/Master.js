'use strict';
const path = process.env.MASTER_AUTH_PATH || '/io/auth';
const host = process.env.MASTER_HOST;


const axios = require('axios')

class Master{
  static auth(data, token) {
    return axios.post(host + path, data, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
  }
}


module.exports = Master;
