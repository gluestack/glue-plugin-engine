import { IAction } from '../core/types/IHasuraEngine';
import { IHasuraMetadata } from './types/IHasuraMetadata';
export default class HasuraMetadata implements IHasuraMetadata {
    hasuraEnvs: any;
    private pluginName;
    constructor(pluginName: any);
    dropAction(actionName: string): Promise<any>;
    createAction(action: IAction): Promise<any>;
    createActionPermission(action: IAction): Promise<any>;
    createCustomTypes(actions: IAction[]): Promise<void>;
    createEvent(tableName: string, events: string[]): Promise<void>;
    dropEvent(tableName: string, events: string[]): Promise<void>;
    tracks(data: any): Promise<void>;
    private makeRequest;
    private captureEnvVars;
}
