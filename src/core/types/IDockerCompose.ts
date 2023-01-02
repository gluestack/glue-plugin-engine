interface IServiceBase {
  container_name: string
  volumes: string[];
  ports?: string[];
  env_file?: string[];
  depends_on?: string[];
  restart: string;
}

interface IServiceWithBuild extends IServiceBase {
  build: string;
}

interface IServiceWithImage extends IServiceBase {
  image: string;
}

export type IService = IServiceWithBuild | IServiceWithImage;
