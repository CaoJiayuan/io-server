'use strict';

require('dotenv').load();

const app = require('./bootstrap');

const Logger = require('./Logger');
const axios = require('axios');

const port = process.env.SERVER_PORT || 3003;

const maxRetries = process.env.MASTER_HOOK_RETRIES || 5;
const retryInterval = process.env.MASTER_HOOK_RETRY_INTERVAL || 2000;
let retries = 0;
let retryTimer = null;
let masterRequested = false;

require('./routes')(app.express);
require('./events')(app.io);

app.server.listen(port, () => {
  Logger.info(`>>>>>>>>>>>>>> Server started, port [${port}] <<<<<<<<<<<<<<<`);
  masterRequested || broadcastStartUp();
});

function broadcastStartUp() {
  Logger.info(`requesting mater server...`, false);
  let url = process.env.MASTER_HOST + process.env.MASTER_HOOK_PATH;
  axios.post(url, {
    event: 'io:start-up',
    time : new Date().getTime() / 1000
  }).then(response => {
    Logger.info(`master respond start up hook! code ${response.status}, body : ${JSON.stringify(response.data)}`);
    masterRequested = true;
    retryTimer && clearTimeout(retryTimer);
  }).catch(error => {
    let re = retries > 0 ? `retries: ${retries}}` : '';
    Logger.warn(`master response error! code ${error.response.status}, body : ${JSON.stringify(error.response.data)} ${re}`);
    if (retries >= maxRetries) {
      Logger.error(`server can not response start up hook, please check MASTER_HOOK_PATH is set right`);
      masterRequested = true;
      retryTimer && clearTimeout(retryTimer);
      return error;
    }
    Logger.info(`retry after ${retryInterval / 1000} seconds`, false);

    retryTimer = setTimeout(() => {
      retries++;
      broadcastStartUp();
    }, retryInterval);
  }).catch(err => {

    Logger.error(err)
  });
}

