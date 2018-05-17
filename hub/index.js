"use strict";
class Hub {
    static subscribers = []; // [{channel: [clientIndex, ...]}]
    static subscribes = []; // [{clientIndex: subscriber}]

    static io = null;

    static subscribe(channels, subscriber){

    }

    static register(subscriber) {

    }

    static setIo(io){
        Hub.io = io;
    }
}

module.exports = Hub;
