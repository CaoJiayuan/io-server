'use strict'
const arrayWrap = require('../utils').arrayWrap

class Provider {
  constructor () {
    this.subscribers = []
    this.channels = {}
  }

  broadcast (channel, payload) {

  }

  subscribe (channels, subscriber) {
    let id = this.insertSubscriber(subscriber)
    arrayWrap(channels).forEach(channel => {
      if (this.channels[channel] === undefined) {
        this.channels[channel] = []
      }
      this.channels[channel].push(id)
    })

    return subscriber
  }

  insertSubscriber (subscriber) {
    let length = this.subscribers.length
    this.subscribers.push(subscriber)
    return length
  }

  deleteSubscriber (subscriber) {
    return this.unsubscribe('*', subscriber)
  }

  indexOfSubscriber (subscriber) {
    return this.subscribers.indexOf(subscriber)
  }

  unsubscribe (channels, subscriber) {
    let index = this.indexOfSubscriber(subscriber)
    channels === '*' && this.subscribers.slice(index, 1) // Remove subscriber
    for (let i in this.channels) {
      if (this.channels.hasOwnProperty(i)) {
        let indexS = this.channels[i].indexOf(index)
        this.channels[i].slice(indexS, 1)
      }
    }
    return index
  }

  gatherSubscribers(channel){
    if (channel === '*') {
      return this.subscribers;
    }
    let subs = [];
    arrayWrap(channel).forEach(chan => {
      let subscribers = this.channels[chan]
      if (subscribers === undefined) {
        subscribers = [];
      }
      subs = subs.concat(subscribers.map(index => {
        return this.subscribers[index]
      }))
    })

    return subs;
  }
}

module.exports = Provider