"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateActionPermission = exports.generate = void 0;
var graphqlToJsonSchema = require("@gluestack/graphql-sdl-to-json");
var _a = require("lodash"), replace = _a.replace, has = _a.has, get = _a.get, objectKeys = _a.keys, capitalize = _a.capitalize;
var replaceRefDefinition = function (string) {
    return replace(get(string, "$ref"), "#/definitions/", "");
};
var replaceTypeDefinition = function (string) {
    var _a, _b, _c, _d, _e, _f;
    if ((string === null || string === void 0 ? void 0 : string.type) === "array") {
        if ((_a = string === null || string === void 0 ? void 0 : string.items) === null || _a === void 0 ? void 0 : _a.type["$ref"]) {
            return "[".concat(replace(get((_b = string === null || string === void 0 ? void 0 : string.items) === null || _b === void 0 ? void 0 : _b.type, "$ref"), "#/definitions/", ""), "]");
        }
        if ((_d = (_c = string === null || string === void 0 ? void 0 : string.items) === null || _c === void 0 ? void 0 : _c.type) === null || _d === void 0 ? void 0 : _d.type) {
            return "[".concat(capitalize((_f = (_e = string === null || string === void 0 ? void 0 : string.items) === null || _e === void 0 ? void 0 : _e.type) === null || _f === void 0 ? void 0 : _f.type), "]");
        }
    }
    return replace(get(string, "$ref"), "#/definitions/", "");
};
var requiresReplaceTypeDefinition = function (property) {
    if (property.type && property.type !== "array") {
        return false;
    }
    return true;
};
var createCustomTypes = function (definitions) {
    var body = {
        type: "set_custom_types",
        args: {
            scalars: [],
            enums: [],
            objects: [],
            input_objects: [],
        },
    };
    objectKeys(definitions).forEach(function (defKey) {
        var object = { name: defKey, fields: [] };
        var definition = definitions[defKey];
        var type = get(definition, "type");
        objectKeys(definition.properties).forEach(function (propKey) {
            var property = definition.properties[propKey];
            object.fields.push({
                name: propKey,
                type: (!requiresReplaceTypeDefinition(property)
                    ? capitalize(property.type)
                    : replaceTypeDefinition(property)) + (property.required ? "!" : ""),
            });
        });
        if (type === "object") {
            body.args.objects.push(object);
        }
        if (type === "input_object") {
            body.args.input_objects.push(object);
        }
        if (type === "GRAPHQL_ENUM") {
            body.args.enums.push({
                name: definition.title,
                values: definition.enum.map(function (value) {
                    return {
                        value: value,
                    };
                }),
            });
        }
        if (type === "GRAPHQL_SCALAR") {
            body.args.scalars.push({
                name: definition.title,
            });
        }
    });
    return body;
};
var createAction = function (query, type, kind, forward_client_headers, action) {
    if (kind === void 0) { kind = "synchronous"; }
    if (forward_client_headers === void 0) { forward_client_headers = false; }
    if (action === void 0) { action = null; }
    var name = objectKeys(query.properties)[0];
    var property = query.properties[name];
    var output_type = (!requiresReplaceTypeDefinition(property)
        ? capitalize(property.type)
        : replaceTypeDefinition(property)) + (property.required ? "!" : "");
    var argmnts = [];
    property.arguments.forEach(function (arg) {
        var type = (!requiresReplaceTypeDefinition(arg.type)
            ? capitalize(arg.type.type)
            : replaceTypeDefinition(arg.type)) + (arg.type.required ? "!" : "");
        argmnts.push({ name: arg.title, type: type });
    });
    var body = {
        type: "create_action",
        args: {
            name: name,
            definition: {
                arguments: argmnts,
                handler: "{{ACTION_BASE_URL}}/".concat(action.handler),
                kind: kind,
                forward_client_headers: forward_client_headers,
                output_type: output_type,
                type: type,
            },
        },
    };
    return body;
};
var createActionPermission = function (query, roles) {
    var action = objectKeys(query.properties)[0];
    var body = [];
    for (var _i = 0, roles_1 = roles; _i < roles_1.length; _i++) {
        var role = roles_1[_i];
        body.push({
            type: "create_action_permission",
            args: {
                action: action,
                role: role,
            },
        });
    }
    return body;
};
var generate = function (schema, kind, type, forward_client_headers, action) {
    if (type === void 0) { type = "action"; }
    if (forward_client_headers === void 0) { forward_client_headers = false; }
    if (action === void 0) { action = null; }
    var jsonSchema = graphqlToJsonSchema(schema);
    var definitions = jsonSchema.definitions;
    var isMutation = false, isQuery = false;
    isMutation = has(definitions, "Mutation");
    isQuery = has(definitions, "Query");
    if (!isQuery && !isMutation) {
        console.log("> No Query or Mutation found in schema!");
        process.exit(1);
    }
    if (type === "action") {
        var query = get(definitions, isMutation ? "Mutation" : "Query");
        return createAction(query, isMutation ? "mutation" : "query", kind, forward_client_headers, action);
    }
    else {
        delete definitions[isMutation ? "Mutation" : "Query"];
        return createCustomTypes(definitions);
    }
};
exports.generate = generate;
var generateActionPermission = function (schema, roles) {
    var jsonSchema = graphqlToJsonSchema(schema);
    var definitions = jsonSchema.definitions;
    var isMutation = false, isQuery = false;
    isMutation = has(definitions, "Mutation");
    isQuery = has(definitions, "Query");
    if (!isQuery && !isMutation) {
        console.log("> No Query or Mutation found in schema!");
        process.exit(1);
    }
    var query = get(definitions, isMutation ? "Mutation" : "Query");
    return createActionPermission(query, roles);
};
exports.generateActionPermission = generateActionPermission;
//# sourceMappingURL=generate-action-custom-types.js.map