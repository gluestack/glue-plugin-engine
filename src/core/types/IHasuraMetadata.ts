import { IAction } from "./IHasuraEngine";

export interface IHasuraMetadata {
  dropAction(actionName: string): Promise<void>;
  createCustomTypes(actions: IAction[]): Promise<void>;
  createAction(action: IAction): Promise<string>;

  createEvent(tableName: string, events: string[]): Promise<void>;
  dropEvent(tableName: string, events: string[]): Promise<void>;

  tracks(data: any): Promise<void>;
}
