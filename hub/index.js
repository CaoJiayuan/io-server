'use strict'

class Hub {

  static subscribe (channels, subscriber) {
    let provider = Hub.findProvider(subscriber)
    return provider.subscribe(channels, subscriber)
  }

  static findProvider(subscriber) {
    Hub.initProviders();
    let p = subscriber.provider;

    let provider = Hub.providers[p]

    if (provider === undefined) {
      throw Error(`Can not find provider [${p}]`)
    }

    return provider;
  }

  static register (subscriber) {

  }

  static addProvider (name, provider) {
    Hub.initProviders();
    Hub.providers[name] = provider;
  }
  static initProviders(){
    if (Hub.providers === undefined) {
      Hub.providers = {}
    }
  }
  static broadcast (channel, payload) {
    Hub.initProviders();
    for (let p in Hub.providers) {
      if (Hub.providers.hasOwnProperty(p)) {
        Hub.providers[p].broadcast(channel, payload);
      }
    }
  }

  static unsubscribe(channels, subscriber) {
    let provider = Hub.findProvider(subscriber)
    return provider.unsubscribe(channels, subscriber)
  }
}


module.exports = Hub
