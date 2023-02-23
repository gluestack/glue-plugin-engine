import { ICronObject, IGluestackCron } from './types/IGluestackCron';
export default class GluestackCron implements IGluestackCron {
    collection: ICronObject[];
    daprServices: any;
    private filePath;
    constructor();
    collect(): Promise<boolean>;
    validate(collection: ICronObject[]): Promise<void>;
    start(): Promise<void>;
}
