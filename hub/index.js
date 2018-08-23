'use strict';

class Hub {

  static subscribe(channels, subscriber) {
    let provider = Hub.findProvider(subscriber);
    return provider.subscribe(channels, subscriber);
  }

  static findProvider(subscriber) {
    Hub.initProviders();
    let p = subscriber.provider;

    let provider = Hub.providers[p];

    if (provider === undefined) {
      throw Error(`Can not find provider [${p}]`);
    }

    return provider;
  }

  static addProvider(name, provider) {
    Hub.initProviders();
    Hub.providers[name] = provider;
  }

  static initProviders() {
    if (Hub.providers === undefined) {
      Hub.providers = {};
    }
  }

  static broadcast(channel, payload) {
    Hub.initProviders();
    for (let p in Hub.providers) {
      if (Hub.providers.hasOwnProperty(p)) {
        Hub.providers[p].broadcast(channel, payload);
      }
    }
  }

  static unsubscribe(channels, subscriber) {
    let provider = Hub.findProvider(subscriber);
    return provider.unsubscribe(channels, subscriber);
  }

  static initPrivates(){
    if (Hub.privates === undefined) {
      Hub.privates = [];
    }
  }

  static subscribers(){
    Hub.initProviders();
    let subs = [];
    for (let p in Hub.providers) {
      if (Hub.providers.hasOwnProperty(p)) {
         subs = subs.concat(Hub.providers[p].subscribers);
      }
    }
    return subs;
  }

  static channels(){
    Hub.initProviders();
    let chans = [];
    for (let p in Hub.providers) {
      if (Hub.providers.hasOwnProperty(p)) {
        chans = chans.concat(Hub.providers[p].channels);
      }
    }
    return chans;
  }

  static setPrivates(privates){
    Hub.privates = privates.map(p => {
      let copy = p
      let args = []
      copy.match(/\{.*?\}/g).forEach(m => {
        p = p.replace(m, '(.*?)')
        args.push(m.replace('{', '').replace('}', ''))
      })
      return [p, args]
    })
  }
}


module.exports = Hub;
