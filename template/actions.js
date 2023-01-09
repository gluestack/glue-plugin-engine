const { DaprClient, HttpMethod } = require('@dapr/dapr');

module.exports = async (req, res) => {
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
};
