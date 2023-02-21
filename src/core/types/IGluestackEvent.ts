export interface IGluestackEvent {
  events: any;
  eventsPath: string;
  hasuraPluginName: string;

  scanEvents(): Promise<void>;
  getEventsByType(type: string): Promise<any>;
}
