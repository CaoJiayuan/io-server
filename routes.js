'use strict'
let HttpSubscriber = require('./subscriber/HttpSubscriber')
const Hub = require('./hub')

let bodyParser = require('body-parser');
function routes (express) {
  express.use(bodyParser.json())

  express.post('/subscribe', (req, res) => {
    let id = req.body.id;
    Hub.subscribe(req.body.channels || 'master', new HttpSubscriber(req.body.hooks, id))

    res.send('ok')
  })

  express.post('/broadcast', (req, res) => {
    let body = req.body;
    let channels = body.channels || '*';

  })
}

module.exports = routes