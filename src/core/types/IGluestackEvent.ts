export interface IGluestackEvent {
  events: any;
  eventsPath: string;
  hasuraPluginName: string;
  backendInstancePath: string;

  scanEvents(): Promise<void>;
  getEventsByType(type: string): Promise<any>;
}
