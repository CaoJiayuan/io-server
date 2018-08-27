'use strict'

let Provider = require('./Provider')
const arrayWrap = require('../utils').arrayWrap


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
        arrayWrap(subscriber[1]).map(sub => sub.notify(event.split('::')[1], payload))
      } else {
        subscriber.notify(event, payload)
      }
    });
  }

  indexOfSubscriber(subscriber){
    return this.subscribers.indexOf(this.subscribers.filter(sub => sub.getId() === subscriber.getId())[0])
  }
}

module.exports = HttpProvider;
