const express = require('express');
const bodyParser = require('body-parser');

const config = require('./handlers/config');
const events = require('./handlers/events');
const actions = require('./handlers/actions');
const appEvents = require('./handlers/app-events');

const app = express();
const port = 9000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Gluestack health-check route
app.get('/health-check', (_req, res) =>
  res
    .status(200)
    .json({
      status: true,
      message: 'Ok'
    })
);

// Gluestack Events Config
app.get('/config/events', config);

// Gluestack action route
app.post('/actions', actions);

// Gluestack db events route
app.post('/events', events);

// Gluestack app events route
app.post('/app/events', appEvents);

// Gluestack Engine
app.listen(port, () => {
  console.log(`Engine app listening on port ${port}`)
});
