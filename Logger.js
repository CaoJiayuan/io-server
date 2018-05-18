'use strict'
let colors = require('colors');

let themes = {
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
}
colors.setTheme(themes);

function Logger () {

}

for (let key in themes) {
  Logger[key] = (message) => console.log(colors[key](message))
}

module.exports = Logger;