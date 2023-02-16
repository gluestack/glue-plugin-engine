export declare const startsWith = "\nevents {\n  worker_connections 1024;\n}\n\nhttp {\n  client_max_body_size 100M;\n  sendfile on;\n";
export declare const endsWith = "}\n";
export declare const setServer: (domain: string, locations: string[], containsBackend?: boolean) => Promise<string>;
export declare const createRewriteRule: (path: string, proxy_path: string) => string;
export declare const includeBackend: () => string;
export declare const setLocation: (path: string, proxy_instance: string, proxy_path: string, host?: string, size_in_mb?: number) => string;
