'use strict'
let Subscriber = require('./Subscriber');


class WebSocketSubscriber extends Subscriber {
  io = null;
  client = null;

  constructor (io, client) {
    super()
    this.io = io;
    this.client = client;
  }

  subscribe(channel){
    this.client.join(channel)
  }
}