export default class NginxConf {
    upstreams: any[];
    private filename;
    private subdirectory;
    private prodDir;
    constructor();
    generateDev(): Promise<void>;
    generateProd(): Promise<void>;
    addRouter(packageName: string, instance: string, port: number, string: string, isBackend?: boolean): Promise<boolean>;
    private toConf;
    private toProdConf;
    private hasServerName;
}
