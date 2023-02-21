import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";
export interface IStatelessPlugin {
    name: string;
    type: string;
    template_folder: string;
    instance: string;
    path: string;
    status?: string;
    instance_object?: any;
    getInitDbPath?: () => string;
    gluePluginStore?: IGlueStorePlugin;
}
