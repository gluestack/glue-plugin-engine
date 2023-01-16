/**
 * This function is the entry point for the gluestack app.invoke.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *
 * @returns {Promise<import('express').Response>}
 */
const { DaprClient, HttpMethod } = require('@dapr/dapr');

module.exports = async (req, res) => {
  const { headers, body } = req;

  if (!body.hasOwnProperty('action_name')) {
    return res.json({ status: false, message: 'Missing "action_name"' });
  }

  const daprHost = '127.0.0.1';
  const daprPort = 3500;

  const client = new DaprClient(daprHost, daprPort);

  const serviceMethod = 'functions';
  const serviceAppId = body.action_name;
  const data = body.hasOwnProperty('data') ? { ...body.data } : {};

  try {
    await client.invoker.invoke(
      serviceAppId,
      serviceMethod,
      HttpMethod.POST,
      data,
      { headers: { ...headers, "X-Glue-Invoke": "client" } }
    );

    return res.status(200).json({
      status: true,
      message: 'OK'
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      status: false,
      message: 'Something went wrong!'
    });
  }
};
