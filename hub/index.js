'use strict'

class Hub {

  static subscribe (channels, subscriber) {

  }

  static register (subscriber) {

  }

  static addProvider (provider) {
    if (Hub.providers === undefined) {
      Hub.providers = []
    }
    Hub.providers.push(provider)
  }

  static broadcast (channel, payload) {

  }
}

module.exports = Hub
