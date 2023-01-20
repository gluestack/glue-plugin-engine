import { IAction } from "src/core/types/IHasuraEngine";

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
        type:
          (property.type
            ? capitalize(property.type)
            : replaceRefDefinition(property)) + "!",
      });
    });

    if (type === 'object') {
      body.args.objects.push(object);
    }

    if (type === 'input_object') {
      body.args.input_objects.push(object);
    }

    if (type === 'GRAPHQL_ENUM') {
      body.args.enums.push({
        name: definition.title,
        values: definition.enum.map((value: string) => {
          return {
            value: value
          }
        })
      });
    }

    if (type === 'GRAPHQL_SCALAR') {
      body.args.scalars.push({
        name: definition.title
      });
    }
  });

  return body;
};

const createAction = (
  query: any, type: string, kind: string = 'synchronous', action:IAction = null
) => {
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
        handler: `{{ACTION_BASE_URL}}/${action.handler}`,
        kind,
        output_type,
        type
      }
    }
  };

  return body;
};

const createActionPermission = (
  query: any, roles: string[]
) => {
  const action: string = objectKeys(query.properties)[0];

  const body: any = {
    type: "bulk",
    args: []
  };

  for (const role of roles) {
    body.args.push({
      type: 'create_action_permission',
      args: {
        action,
        role
      }
    })
  }
  
  return body;
};

export const generate = (
  schema: string, kind: string, type: string = 'action', action:IAction = null
): Promise<any> => {
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
    return createAction(query, isMutation ? 'mutation' : 'query', kind, action);
  } else {
    delete definitions[isMutation ? 'Mutation' : 'Query'];
    return createCustomTypes(definitions);
  }
}

export const generateActionPermission = (
  schema: string, roles: string[]
): Promise<any> => {
  const jsonSchema: any = graphqlToJsonSchema(schema);
  const { definitions } = jsonSchema;

  let isMutation: boolean = false, isQuery: boolean = false;

  isMutation = has(definitions, 'Mutation');
  isQuery = has(definitions, 'Query');

  if (!isQuery && !isMutation) {
    console.log('> No Query or Mutation found in schema!');
    process.exit(1);
  }

  const query: string = get(definitions, isMutation ? 'Mutation' : 'Query');
  return createActionPermission(query, roles);
};
