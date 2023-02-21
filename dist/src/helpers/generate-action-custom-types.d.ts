import { IAction } from "src/core/types/IHasuraEngine";
export declare const generate: (schema: string, kind: string, type?: string, action?: IAction) => Promise<any>;
export declare const generateActionPermission: (schema: string, roles: string[]) => Promise<any>;
