import { IGluestackEvent } from './types/IGluestackEvent';
export default class GluestackEvent implements IGluestackEvent {
    events: any;
    eventsPath: string;
    hasuraPluginName: string;
    daprServices: any;
    constructor(hasuraPluginName: string);
    scanEvents(): Promise<void>;
    getEventsByType(type: string): Promise<any>;
    private readEventsDir;
    private prepareConfigJSON;
    private validateEvents;
}
