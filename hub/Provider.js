'use strict';
const arrayWrap = require('../utils').arrayWrap;
const Hub = require('./index')
const Master = require('./Master')
const Logger = require('../Logger')



class Provider {
  constructor() {
    this.subscribers = [];
    this.channels = {};
  }

  broadcast(channel, payload) {

  }

  subscribe(channels, subscriber) {
    let id = this.insertSubscriber(subscriber);
    return Promise.all(arrayWrap(channels).map(channel => {
      if (this.channels[channel] === undefined) {
        this.channels[channel] = [];
      }
      return this.authChannel(channel, subscriber).then(re => {
        this.channels[channel].indexOf(id) > -1 || this.channels[channel].push(id);
      })
    }));

    // return subscriber;
  }

  authChannel(channel, subscriber) {
    if (Hub.privates) {
      return Promise.all(Hub.privates.map(p => {
        let match = new RegExp(p[0], 'g').exec(channel)

        if(match && match.length > 0) {
          match.shift()
          let data = {}
          for(let i = 0; i < match.length; i ++) {
            data[p[1][i]] = match[i]
          }
          return Master.auth(data, subscriber.token).then(re => {
            Logger.debug('auth response ' + JSON.stringify(re.data), false)
            return true
          }).catch(error => {
            return Promise.reject({
              channel: channel,
              response: error.response ? error.response.data : {}
            })
          })
        } else {
          return Promise.resolve(true)
        }
      }))
    } else {
      return Promise.resolve(true)
    }
  }

  insertSubscriber(subscriber) {
    let length = this.subscribers.length;
    let index = this.indexOfSubscriber(subscriber);
    if (index > -1) {
      return index;
    }
    this.subscribers.push(subscriber);
    return length;
  }

  deleteSubscriber(subscriber) {
    return this.unsubscribe('*', subscriber);
  }

  indexOfSubscriber(subscriber) {
    return this.subscribers.indexOf(subscriber);
  }

  unsubscribe(channels, subscriber) {
    let index = this.indexOfSubscriber(subscriber);
    channels === '*' && this.subscribers.slice(index, 1); // Remove subscriber
    for (let i in this.channels) {
      if (this.channels.hasOwnProperty(i)) {
        let indexS = this.channels[i].indexOf(index);
        this.channels[i].slice(indexS, 1);
      }
    }
    return index;
  }

  gatherSubscribers(channel) {
    if (typeof channel === 'string') {
      let ce = Provider.getChannelEvent(channel);
      if (ce[0] === '*') {
        return [
          [`*::${ce[1]}`, this.subscribers]
        ];
      }
    }
    let subs = [];
    arrayWrap(channel).forEach(chan => {
      let channelEvent = Provider.getChannelEvent(chan);

      let ch = channelEvent[0];
      let event = channelEvent[1];

      let subscribers = this.channels[ch];
      if (subscribers === undefined) {
        subscribers = [];
      }
      subs = subs.concat(subscribers.map(index => {

        return [`${ch}::${event}`, this.subscribers[index]];
      }));
    });

    return subs;
  }

  static getChannelEvent(channel){
    let partials = channel.split('::', 2);
    let event = 'message';
    if (partials.length > 1) {
      event = partials[1];
    }
    let ch = partials[0];
    return [ch, event];
  }
}

module.exports = Provider;
