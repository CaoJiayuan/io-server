'use strict'

let Provider = require('./Provider')

class HttpProvider extends Provider {

  constructor () {
    super()
  }

  broadcast (channel, payload) {

  }

}

module.exports = HttpProvider;