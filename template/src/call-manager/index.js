const syncCallsWebhook = require('./sync-webhook');
const syncCallsFunction = require('./sync-function');
const asyncCallsWebhook = require('./async-webhook');
const asyncCallsFunction = require('./async-function');

module.exports = async (callbacks, payload) => {
  const syncCalls = {
    function: [],
    webhook: []
  };

  const asyncCalls = {
    function: [],
    webhook: []
  };

  for await (const callback of callbacks) {
    const { kind, type, value } = callback;

    if (kind === 'sync' && type === 'function') {
      syncCalls.function.push({ type, value });
    }

    if (kind === 'sync' && type === 'webhook') {
      syncCalls.webhook.push({ type, value });
    }

    if (kind === 'async' && type === 'function') {
      asyncCalls.function.push({ type, value });
    }

    if (kind === 'async' && type === 'webhook') {
      asyncCalls.webhook.push({ type, value });
    }
  }

  if (syncCalls.webhook.length) {
    await syncCallsWebhook(syncCalls.webhook, payload);
  }

  if (syncCalls.function.length) {
    await syncCallsFunction(syncCalls.function, payload);
  }

  if (asyncCalls.webhook.length) {
    await asyncCallsWebhook(asyncCalls.webhook, payload);
  }

  if (asyncCalls.function.length) {
    await asyncCallsFunction(asyncCalls.function, payload);
  }
};