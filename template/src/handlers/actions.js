/**
 * This function is the entry point for the gluestack actions.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *
 * @returns {Promise<void>}
 */
const { DaprClient, HttpMethod } = require('@dapr/dapr');

module.exports = async (req, res) => {
  const { headers, body } = req;
  if (headers["content-length"]) delete headers["content-length"];

  const daprHost = '127.0.0.1';
  const daprPort = 3500;

  const client = new DaprClient(daprHost, daprPort);

  const serviceAppId = body.action.name;
  const serviceMethod = 'functions';
  
  try {
    const data = await client.invoker.invoke(
      serviceAppId,
      serviceMethod,
      HttpMethod.POST,
      { ...body },
      { headers }
    );
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({
      status: false,
      ...e.message
    });
  }
};
