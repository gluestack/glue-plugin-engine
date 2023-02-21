import { IAction } from '../core/types/IHasuraEngine';
import { IHasuraMetadata } from './types/IHasuraMetadata';
export default class HasuraMetadata implements IHasuraMetadata {
    hasuraEnvs: any;
    private pluginName;
    constructor(pluginName: any);
    dropAction(actionName: string): Promise<void>;
    createAction(action: IAction): Promise<string>;
    createActionPermission(action: IAction): Promise<string>;
    createCustomTypes(actions: IAction[]): Promise<void>;
    createEvent(tableName: string, events: string[]): Promise<void>;
    dropEvent(tableName: string, events: string[]): Promise<void>;
    tracks(data: any): Promise<void>;
    private makeRequest;
    private captureEnvVars;
}
