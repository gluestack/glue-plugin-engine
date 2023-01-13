const express = require('express');
const bodyParser = require('body-parser');

const cronTab = require('./cron');
const job = require('./queue/job');
const config = require('./handlers/config');
const events = require('./handlers/events');
const invoke = require('./handlers/invoke');
const actions = require('./handlers/actions');
const appEvents = require('./handlers/app-events');
const queuePush = require('./handlers/queue-push');

const app = express();
const port = 9000;

// Gluestack Queue
job.init();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Gluestack health-check route
app.get('/health-check', (_req, res) => res.status(200).json({ status: true, message: 'Ok' }));

// Gluestack action route
app.post('/actions', actions);

// Gluestack db events route
app.post('/events', events);

// Gluestack app events route
app.post('/app/events', appEvents);

// Gluestack invoke route
app.post('/invoke', invoke);

// Gluestack Config
app.get('/glue/config', config);

// Gluestack queue job push route
app.post('/queue/push', queuePush);

// Gluestack Engine
app.listen(port, () => {
  console.log(`Engine app listening on port ${port}`)
});

// Gluestack CRON
cronTab.init();
