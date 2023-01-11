const { DaprClient, HttpMethod } = require('@dapr/dapr');

module.exports = async (callbacks, payload) => {
  const daprPort = 3500;
  const daprHost = '127.0.0.1';
  const serviceMethod = 'functions';

  const client = new DaprClient(daprHost, daprPort);

  for await (const callback of callbacks) {
    const { value } = callback;

    const serviceAppId = value;

    await client.invoker.invoke(
      serviceAppId,
      serviceMethod,
      HttpMethod.POST,
      { ...payload },
      {}
    );
  }
};
