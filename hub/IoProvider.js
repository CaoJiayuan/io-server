'use strict';

let Provider = require('./Provider');

class IoProvider extends Provider {

  constructor(io) {
    super();
    this.io = io;
  }

  broadcast(channel, payload) {
    if (channel instanceof String) {
      let ce = Provider.getChannelEvent(channel);
      if (ce[0] === '*') {
        return this.io.emit(`*::${ce[1]}`, payload);
      }
    }

    let subs = this.gatherSubscribers(channel);

    subs.forEach(subscriber => {
      let event = 'message';

      if (subscriber instanceof Array) {
        event  = subscriber[0];
        subscriber = subscriber[1];
      }

      subscriber.notify(event, payload)
    });
  }
}

module.exports = IoProvider;
