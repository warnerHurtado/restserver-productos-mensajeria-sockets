const Server = require('./models/server');

require('dotenv').config();
require('colors');


const server = new Server();

server.listen();
