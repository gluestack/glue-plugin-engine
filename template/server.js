const express = require('express');
const bodyParser = require('body-parser');
const { readFileSync } = require('node:fs');

const actions = require('./actions');
const events = require('./events');

const app = express();
const port = 9000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Gluestack health-check route
app.get('/health-check', (_req, res) => {
  res.status(200).json({status: true, message: 'Ok'});
});

// Gluestack Events Config
app.get('/config/events', (req, res) => {
  const content = readFileSync('./config.json');
  try {
    return res.status(200).json({status: true, data: JSON.parse(content)});
  } catch (e) {
    return res.status(200).json({status: false, data: {}});
  }
});

// Gluestack action route
app.post('/actions', actions);

// Gluestack events route
app.post('/events', events);

app.listen(port, () => {
  console.log(`Engine app listening on port ${port}`)
});
