'use strict'

let Provider = require('./Provider')

class HttpProvider extends Provider {

  constructor () {
    super()
  }

  broadcast (channel, payload) {
    let subs = this.gatherSubscribers(channel);


    subs.forEach(subscriber => {
      let event = 'message';

      if (subscriber instanceof Array) {
        event  = subscriber[0];
        subscriber = subscriber[1];
      }

      subscriber.notify(event.split('::')[1], payload)
    });
  }

}

module.exports = HttpProvider;