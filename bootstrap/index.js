const express = require('express')();
const server = require('http').createServer(express);
const io = require('socket.io').listen(server);


module.exports = {
  io,
  express,
  server
}