"use strict";
const ev = require('./ev')
const Hub = require('./hub')
const IoSubscriber = require('./subscriber/IoSubscriber')


function events (io) {
  io.on(ev.CONNECTION, function (client) {
    let subscriber = new IoSubscriber(client)

    client.on(ev.SUBSCRIBE, data => {
      Hub.subscribe(data.channels, subscriber)
    })

    client.on(ev.DISCONNECT, () => {
      Hub.unsubscribe('*', subscriber)
    })
    client.on(ev.BROADCAST, data => {
      let channels = data.channels || '*'
      Hub.broadcast(channels, data.payload)
    })
  });
}
module.exports = events;