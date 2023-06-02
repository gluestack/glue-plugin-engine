import { IStatelessPlugin } from "./types/IStatelessPlugin";
import { IHasuraEngine } from "./types/IHasuraEngine";
export default class HasuraEngine implements IHasuraEngine {
    pluginName: string;
    actionPlugins: IStatelessPlugin[];
    private metadata;
    private events;
    private actions;
    private actionGQLFile;
    private actionSettingFile;
    private payload;
    constructor(actionPlugins: IStatelessPlugin[]);
    exportMetadata(): Promise<void>;
    applyMetadata(): Promise<void>;
    applyMigrate(): Promise<void>;
    applySeed(): Promise<void>;
    reapplyActions(): Promise<void>;
    private getMetadata;
    private replaceMetadata;
    reapplyEvents(): Promise<void>;
    applyTracks(): Promise<string>;
    private scanActions;
    private createActions;
    private createCustomTypes;
}
