"use strict";
exports.__esModule = true;
exports.generateActionCustomTypes = void 0;
var graphqlToJsonSchema = require('@gluestack/graphql-sdl-to-json');
var _a = require('lodash'), replace = _a.replace, has = _a.has, get = _a.get, objectKeys = _a.keys, capitalize = _a.capitalize;
var replaceRefDefinition = function (string) {
    return replace(get(string, '$ref'), '#/definitions/', '');
};
var createCustomTypes = function (definitions) {
    var body = {
        type: 'set_custom_types',
        args: {
            scalars: [],
            enums: [],
            objects: [],
            input_objects: []
        }
    };
    objectKeys(definitions).forEach(function (defKey) {
        var object = { name: defKey, fields: [] };
        var definition = definitions[defKey];
        var type = get(definition, 'type');
        objectKeys(definition.properties).forEach(function (propKey) {
            var property = definition.properties[propKey];
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
var createAction = function (query, type, kind) {
    if (kind === void 0) { kind = 'synchronous'; }
    var name = objectKeys(query.properties)[0];
    var property = query.properties[name];
    var output_type = replaceRefDefinition(property);
    var argmnts = [];
    property.arguments.forEach(function (arg) {
        var type = has(arg.type, 'type') ? capitalize(arg.type.type) + '!' : replaceRefDefinition(arg.type) + '!';
        argmnts.push({ name: arg.title, type: type });
    });
    var body = {
        type: 'create_action',
        args: {
            name: name,
            definition: {
                arguments: argmnts,
                handler: '{{ACTION_BASE_URL}}',
                kind: kind,
                output_type: output_type,
                type: type
            }
        }
    };
    return body;
};
var generateActionCustomTypes = function (schema, kind) {
    var jsonSchema = graphqlToJsonSchema(schema);
    var definitions = jsonSchema.definitions;
    var isMutation = false, isQuery = false;
    isMutation = has(definitions, 'Mutation');
    isQuery = has(definitions, 'Query');
    if (!isQuery && !isMutation) {
        console.log('> No Query or Mutation found in schema!');
        process.exit(1);
    }
    var query = get(definitions, isMutation ? 'Mutation' : 'Query');
    delete definitions[isMutation ? 'Mutation' : 'Query'];
    var customTypesData = createCustomTypes(definitions);
    var actionData = createAction(query, isMutation ? 'mutation' : 'query', kind);
    return { customTypesData: customTypesData, actionData: actionData };
};
exports.generateActionCustomTypes = generateActionCustomTypes;
//# sourceMappingURL=generate-action-custom-types.js.map