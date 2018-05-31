'use strict';
let HttpSubscriber = require('./subscriber/HttpSubscriber');
const Hub = require('./hub');
let bodyParser = require('body-parser');
const Logger = require("./Logger");
const masterChannel = process.env.MASTER_CHANNEL || 'master';

function routes(express) {
  express.use(bodyParser.json());

  express.post('/login', (req, res) => {
    let key = req.body.key;
    if (key === process.env.MASTER_KEY) {
      generateToken({}).then(token => res.send({
        token
      })).catch(err => {
        Logger.error(`Generate token error ${err}`)
        res.sendStatus(500)
      })
    } else  {
      res.sendStatus(401);
    }
  });

  express.post('/subscribe', (req, res) => {
    let id = req.body.id;
    Hub.subscribe(req.body.channels || masterChannel, new HttpSubscriber(req.body.hooks, id));

    Logger.info(req.body, false)
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

function generateToken(payload = {}) {
  let secret = process.env.JWT_SECRET || 'somerandsecret';
  let jwt = require('jsonwebtoken');

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, (err, token) => {
      err ? reject(err) : resolve(token)
    })
  })
}

module.exports = routes;
