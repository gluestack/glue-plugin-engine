export default class GluestackWatcher {
    isRestarting: boolean;
    private watcher;
    constructor(paths: string[]);
    on(event: string, cb: (path: string) => void): void;
    close(): void;
    restart(status: boolean): void;
    getStatus(): boolean;
}
