const generateEvents = async (events: string[]) => {
  const body: any = {};

  const addOrUpdateEvent: any = {
    columns: '*',
    payload: '*'
  };

  const removeEvent: any = {
    columns: '*'
  };


  for await (const event of events) {
    if (event === 'insert') {
      body.insert = addOrUpdateEvent;
    }

    if (event === 'update') {
      body.update = addOrUpdateEvent;
    }

    if (event === 'delete') {
      body.delete = removeEvent;
    }
  }

  return body;
};

export const generate = async (table: string, sourceName: string, events: string[]) => {
  return {
    type: 'pg_create_event_trigger',
    args: {
      name: `${table}_trigger`,
      table: {
        name: table,
        schema: 'public'
      },
      source: sourceName,
      webhook: '{{EVENT_BASE_URL}}',
      replace: false,
      cleanup_config: {
        schedule: "0 0 * * *",
        batch_size: 10000,
        clear_older_than: 168,
        timeout: 60,
        clean_invocation_logs: false,
        paused: false
      },
      ...(await generateEvents(events))
    }
  };
};
