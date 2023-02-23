export interface ICronObject {
    schedule: string;
    type: "webhook" | "function";
    value: string;
}
export interface IGluestackCron {
    collection: ICronObject[];
    start(): Promise<void>;
    collect(): Promise<boolean>;
    validate(collection: ICronObject[]): Promise<void>;
}
