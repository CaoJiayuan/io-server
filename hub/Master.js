'use strict';
const path = process.env.MASTER_AUTH_PATH || '/io/auth';
const host = process.env.MASTER_HOST;


const axios = require('axios')

class Master{
  static auth(data, token) {
    return new Promise((revole, reject) => {
      axios.post(host + path, data, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(revole).catch(err => {
        if (!err.response) {
          revole()
        } else {
          reject(err)
        }
      })
    })
  }
}


module.exports = Master;
