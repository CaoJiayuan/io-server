"use strict";
const ev = require('./ev')
const Hub = require('./hub')


function events (io) {
  io.on(ev.CONNECTION, function (client) { /* … */

  });
}
module.exports = events;