"use strict";

require('dotenv').load();

const app = require('./bootstrap');

const Logger = require('./Logger');

const port = process.env.SERVER_PORT || 3003

require('./routes')(app.express)
require('./events')(app.io)

app.server.listen(port, () => Logger.info(`Server on port [${port}]`));
