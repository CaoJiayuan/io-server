"use strict";
const express = require('express')();
const server = require('http').createServer(express);
const Hub = require('../hub');
const IoProvider = require('../hub/IoProvider');
const HttpProvider = require('../hub/HttpProvider');

const io = require('socket.io').listen(server,  {
  handlePreflightRequest: function (req, res) {
    let headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': 'http://demo.test',
      'Access-Control-Allow-Credentials': true
    }
    res.writeHead(200, headers);
    res.end();
  }
});

Hub.addProvider('io', new IoProvider(io))
Hub.addProvider('http', new HttpProvider(io))

module.exports = {
  io,
  express,
  server
}