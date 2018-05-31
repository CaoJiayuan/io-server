'use strict';
let HttpSubscriber = require('./subscriber/HttpSubscriber');
const Hub = require('./hub');
let bodyParser = require('body-parser');
const Logger = require("./Logger");
const masterChannel = process.env.MASTER_CHANNEL || 'master';
const jwtSecret = process.env.JWT_SECRET || 'somerandsecret';
const jwt = require('jsonwebtoken');
const parseJWT = require('./utils').parseJWT

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

  express.use('/broadcast', auth);
  express.use('/subscribe', auth);

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

module.exports = routes;
