'use strict';
let HttpSubscriber = require('./subscriber/HttpSubscriber');
const Hub = require('./hub');
let bodyParser = require('body-parser');
const masterChannel = process.env.MASTER_CHANNEL || 'master';

function routes(express) {
  express.use(bodyParser.json());

  express.post('/subscribe', (req, res) => {
    let id = req.body.id;
    Hub.subscribe(req.body.channels || masterChannel, new HttpSubscriber(req.body.hooks, id));

    res.send('ok');
  });

  express.post('/broadcast', (req, res) => {
    let body = req.body;
    let channels = body.channels || '*';
    let event = body.event || 'message';
    let payload = body.payload || {};

    let chan = channels;
    if (channels instanceof String) {
      chan = `${channels}::${event}`;
    }

    Hub.broadcast(chan, payload);

    res.send('ok');
  });
}

module.exports = routes;
