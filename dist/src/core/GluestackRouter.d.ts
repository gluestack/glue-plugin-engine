export default class GluestackRouter {
    pluginName: string;
    instancePath: string;
    constructor();
    listEndpoints(): Promise<void>;
    listRoutes(): Promise<void>;
}
