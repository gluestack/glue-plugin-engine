"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateActionPermission = exports.generate = void 0;
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
                type: (property.type
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
                values: definition.enum.map(function (value) {
                    return {
                        value: value
                    };
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
var createAction = function (query, type, kind, action) {
    if (kind === void 0) { kind = 'synchronous'; }
    if (action === void 0) { action = null; }
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
                handler: "{{ACTION_BASE_URL}}/".concat(action.handler),
                kind: kind,
                output_type: output_type,
                type: type
            }
        }
    };
    return body;
};
var createActionPermission = function (query, roles) {
    var action = objectKeys(query.properties)[0];
    var body = {
        type: "bulk",
        args: []
    };
    for (var _i = 0, roles_1 = roles; _i < roles_1.length; _i++) {
        var role = roles_1[_i];
        body.args.push({
            type: 'create_action_permission',
            args: {
                action: action,
                role: role
            }
        });
    }
    return body;
};
var generate = function (schema, kind, type, action) {
    if (type === void 0) { type = 'action'; }
    if (action === void 0) { action = null; }
    var jsonSchema = graphqlToJsonSchema(schema);
    var definitions = jsonSchema.definitions;
    var isMutation = false, isQuery = false;
    isMutation = has(definitions, 'Mutation');
    isQuery = has(definitions, 'Query');
    if (!isQuery && !isMutation) {
        console.log('> No Query or Mutation found in schema!');
        process.exit(1);
    }
    if (type === 'action') {
        var query = get(definitions, isMutation ? 'Mutation' : 'Query');
        return createAction(query, isMutation ? 'mutation' : 'query', kind, action);
    }
    else {
        delete definitions[isMutation ? 'Mutation' : 'Query'];
        return createCustomTypes(definitions);
    }
};
exports.generate = generate;
var generateActionPermission = function (schema, roles) {
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
    return createActionPermission(query, roles);
};
exports.generateActionPermission = generateActionPermission;
//# sourceMappingURL=generate-action-custom-types.js.map