const express = require('express');
const server = express();
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const path = require("path");
const port = 3000 || process.env.PORT;

server.use(express.json())
server.use(express.urlencoded({extended: true}))

server.use('/api', require('./routes/api').route)
server.use("/", express.static(path.join(__dirname, "./public")));

server.listen(port, () => {

  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));

  console.log("Express Listening at http://localhost:" + port);

});
