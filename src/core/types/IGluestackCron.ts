export interface ICronObject {
  schedule: string;
  type: "webhook" | "function";
  value: string;
}

export interface IGluestackCron {
  collection: ICronObject[];

  start(): Promise<void>;
  collect(): Promise<void>;
  validate(collection: ICronObject[]): Promise<void>;
}
