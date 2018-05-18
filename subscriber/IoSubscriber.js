'use strict'
let Subscriber = require('./Subscriber');


class IoSubscriber extends Subscriber {

  constructor (client) {
    super()
    // this.io = io;
    this.client = client;
    this.provider = 'io';
  }

  getId(){
    return this.client.id
  }
  notify(channels, payload) {
    this.client.emit('broadcast', {
      channels,
      payload
    })
  }
}

module.exports = IoSubscriber;