'use strict'

let Provider = require('./Provider')

class IoProvider extends Provider {

  constructor (io) {
    super()
    this.io = io
  }

  broadcast (channel, payload) {
    if (channel === '*') {
      this.io.emit('broadcast', payload)
    }
    let subs = this.gatherSubscribers(channel);

    subs.forEach(subscriber => subscriber.notify(payload))
  }
}

module.exports = IoProvider;