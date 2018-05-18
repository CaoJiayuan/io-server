'use strict'

function routes (express) {
  express.post('/subscribe', (req, res) => {
    res.send('hello')
  })

  express.post('/broadcast', (req, res) => {

  })
}

module.exports = routes