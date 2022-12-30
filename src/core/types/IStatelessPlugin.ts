export interface IStatelessPlugin {
  name: string;
  template_folder: string;
  instance: string;
  path: string;
  status: string;
  port: string;
  "container_id/pid": string;
  dockerfile_path?: string;
}