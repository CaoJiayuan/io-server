'use strict';

let Provider = require('./Provider');
const formatError = require('../utils').formatError
const ev = require('../ev')

class IoProvider extends Provider {

  constructor(io) {
    super();
    this.io = io;
  }

  broadcast(channel, payload, broadcaster) {
    if (typeof channel === 'string') {
      let ce = Provider.getChannelEvent(channel);
      if (ce[0] === '*') {
        return this.io.emit(`*::${ce[1]}`, payload);
      }
    }

    let subs = this.gatherSubscribers(channel);


    subs.forEach(subscriber => {
      let chanelEvent = subscriber[0];
      subscriber = subscriber[1];

      let [channel, event] = chanelEvent.split('::')

      if (broadcaster) {
        this.authChannel(channel, broadcaster).then(re => {
          subscriber.notify(chanelEvent, payload)
        }).catch(err => {
          broadcaster.notify(ev.ERROR, formatError('broadcast', err))
        })
      } else {
        subscriber.notify(chanelEvent, payload)
      }

    });
  }
}

module.exports = IoProvider;
