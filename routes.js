'use strict';
let HttpSubscriber = require('./subscriber/HttpSubscriber');
const Hub = require('./hub');
let bodyParser = require('body-parser');
const Logger = require("./Logger");
const masterChannel = process.env.MASTER_CHANNEL || 'master';
const jwtSecret = process.env.JWT_SECRET || 'somerandsecret';
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const parseJWT = utils.parseJWT
const arrayWrap = utils.arrayWrap
const ttl = parseInt(process.env.JWT_TTL)


function routes(express) {
  express.use(bodyParser.json());

  express.post('/login', (req, res) => {
    let key = req.body.key;
    if (key === process.env.MASTER_KEY) {
      Logger.info(`Client login, subscriber: ${req.body._id}`, false)
      let payload = {
        exp: Math.floor(Date.now() / 1000) + ttl,
        sub: req.body._id
      }
      generateToken(payload).then(token => res.send({
        token,
        exp: payload.exp
      })).catch(err => {
        Logger.error(`Generate token error ${err}`)
        res.sendStatus(500)
      })
    } else  {
      res.sendStatus(401);
    }
  });

  express.use('/subscribe', authIfMaster);
  express.post('/subscribe', (req, res) => {
    let id = req.body.id;
    let sub = new HttpSubscriber(req.body.hooks, id);
    Hub.subscribe(req.body.channels || masterChannel, sub);

    Logger.debug('Server subscribe ' + JSON.stringify(req.body), false)
    res.send('ok');
  });

  express.use('/broadcast', authIfMaster);


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
    Logger.debug('Server broadcast:'+ JSON.stringify(body), false)

    res.send('ok');
  });

  express.use('/config', auth);
  express.post('/config', (req, res) => {
    let body = req.body;
    Hub.setPrivates(body.privates || [])
    res.send('ok');
  })
}

function generateToken(payload = {}) {

  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, (err, token) => {
      err ? reject(err) : resolve(token)
    })
  })
}

function auth(req, res, next){
  let token = req.headers['authorization']

  jwt.verify(parseJWT(token), jwtSecret, function(err, decoded) {
    // err
    // decoded undefined
    if (err) {
      res.status(401).send(err)
    } else {
      next()
    }
  })
}
function authIfMaster(req, res, next) {
  let channels = req.body.channels || '*';
  if(arrayWrap(channels).indexOf(masterChannel) > -1) {
    auth(req, res, next)
  } else {
    next()
  }
}

module.exports = routes;
