"use strict";
let Subscriber = require('./Subscriber');

class HttpSubscriber extends Subscriber {
    constructor(hooks, id){
        super();
        this.provider = 'http'
        this.id = id
        this.hooks = hooks
    }

    notify(channels, payload) {

    }
}

module.exports = HttpSubscriber;
