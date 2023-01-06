const graphqlToJsonSchema = require('@gluestack/graphql-sdl-to-json');
const {
  replace, has, get, keys: objectKeys, capitalize
} = require('lodash');

const replaceRefDefinition = (string: any) =>
  replace(get(string, '$ref'), '#/definitions/', '');

const createCustomTypes = (definitions: any) => {
  const body: any = {
    type: 'set_custom_types',
    args: {
      scalars: [],
      enums: [],
      objects: [],
      input_objects: []
    }
  };

  objectKeys(definitions).forEach((defKey: any) => {
    const object: any = { name: defKey, fields: [] };
    const definition: any = definitions[defKey];
    const type: string = get(definition, 'type');

    objectKeys(definition.properties).forEach((propKey: any) => {
      const property: any = definition.properties[propKey];

      object.fields.push({
        name: propKey,
        type: capitalize(property.type) + '!'
      });
    });

    if (type === 'object') {
      body.args.objects.push(object);
    }

    if (type === 'input_object') {
      body.args.input_objects.push(object);
    }
  });

  return body;
};

const createAction = (query: any, type: string, kind: string = 'synchronous') => {
  const name: string = objectKeys(query.properties)[0];
  const property: any = query.properties[name];
  const output_type: string = replaceRefDefinition(property);
  const argmnts: any = [];

  property.arguments.forEach((arg: any) => {
    const type = has(arg.type, 'type') ? capitalize(arg.type.type) + '!' : replaceRefDefinition(arg.type) + '!';

    argmnts.push({ name: arg.title, type });
  });

  const body: any = {
    type: 'create_action',
    args: {
      name,
      definition: {
        arguments: argmnts,
        handler: 'http://engine:3500/v1.0/invoke/engine/method/actions',
        kind,
        output_type,
        type
      }
    }
  };

  return body;
};

export const generate = (type: string = 'action', schema: string, kind: string) => {
  const jsonSchema: any = graphqlToJsonSchema(schema);
  const { definitions } = jsonSchema;

  let isMutation: boolean = false, isQuery: boolean = false;

  isMutation = has(definitions, 'Mutation');
  isQuery = has(definitions, 'Query');

  if (!isQuery && !isMutation) {
    console.log('> No Query or Mutation found in schema!');
    process.exit(1);
  }

  if (type === 'action') {
    const query: string = get(definitions, isMutation ? 'Mutation' : 'Query');
    return createAction(query, isMutation ? 'mutation' : 'query', kind);
  } else {
    delete definitions[isMutation ? 'Mutation' : 'Query'];
    return createCustomTypes(definitions);
  }
};
