export default class Env {
    keys: any;
    keyCharacter: "%";
    build: "prod" | "dev";
    envs: ChildEnv[];
    filepath: string;
    constructor(build: "prod" | "dev", routes?: any);
    addEnv(instance: string, envContent: any, path: string): Promise<any>;
    generate(): Promise<void>;
    writeEnv(): Promise<void>;
    private getReplaceKeys;
}
declare class ChildEnv {
    prefix: string;
    instance: string;
    keys: any;
    filepath: string;
    constructor(prefix: string, instance: string, keys: any, path: string, build: "dev" | "prod");
    updateKey(key: string, value: string): void;
    writeEnv(): Promise<void>;
}
export {};
