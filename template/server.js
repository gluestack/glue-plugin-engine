const express = require('express');
const bodyParser = require('body-parser');
const { DaprClient, HttpMethod } = require('@dapr/dapr');

const app = express();
const port = 9000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/health-check', (_req, res) => {
  return res.status(200).json({status: true, message: 'Ok'});
});

app.post('/actions', async (req, res) => {
  const { headers, body } = req;

  const daprHost = '127.0.0.1';
  const daprPort = 3500;

  const client = new DaprClient(daprHost, daprPort);

  const serviceAppId = body.action.name;
  const serviceMethod = 'functions';

  await client.invoker.invoke(
    serviceAppId,
    serviceMethod,
    HttpMethod.POST,
    { ...body },
    { headers }
  );

  res.status(200).json({
    status: true,
    message: 'OK'
  });
});

app.listen(port, () => {
  console.log(`Engine app listening on port ${port}`)
});
