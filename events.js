"use strict";
const ev = require('./ev')
const Hub = require('./hub')
const parseJWT = require('./utils').parseJWT

const IoSubscriber = require('./subscriber/IoSubscriber')
const masterChannel = process.env.MASTER_CHANNEL || 'master';
const enableLoginOut = process.env.ENABLE_LOGIN_OUT

function events (io) {
  io.on(ev.CONNECTION, function (client) {
    let token = parseJWT(client.handshake.headers['authorization']);
    let subscriber = new IoSubscriber(client, token)

    client.on(ev.SUBSCRIBE, data => {
      Hub.subscribe(data.channels, subscriber)
    })

    client.on(ev.DISCONNECT, () => {
      Hub.unsubscribe('*', subscriber)
      enableLoginOut && Hub.broadcast(masterChannel + '::logout', {token})
    })
    client.on(ev.BROADCAST, data => {
      let channels = data.channels || '*'
      Hub.broadcast(channels, data.payload)
    })
    client.on(ev.UNSUBSCRIBE, data => {
      let channels = data.channels || '*'
      Hub.unsubscribe(channels, subscriber)
    })
  });
}
module.exports = events;
