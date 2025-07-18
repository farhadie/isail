// Example express application adding the parse-server module to expose Parse
// compatible API routes.

import express from 'express';
import { ParseServer } from 'parse-server';
import path from 'path';
import http from 'http';
import { config } from './config.js';

const __dirname = path.resolve();
const app = express();

//Use ejs for creating template HTML files
app.engine('.html', require('ejs').__express);
app.set('view engine', 'ejs');

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/snap', express.static(path.join(__dirname, '/Snap')));

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
const server = new ParseServer(config);
await server.start();
app.use(mountPath, server.app);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.render(path.join(__dirname, '/views/exercise_select.html'));
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

/*app.get('/snap', function (req, res) {
  res.sendFile(path.join(__dirname, '/Snap/index.html'));
});*/

const port = process.env.PORT || 1337;
const httpServer = http.createServer(app);
httpServer.listen(port, function () {
  console.log('parse-server-example running on port ' + port + '.');
});
// This will enable the Live Query real-time server
await ParseServer.createLiveQueryServer(httpServer);
console.log(`Visit http://localhost:${port}/test to check the Parse Server`);
