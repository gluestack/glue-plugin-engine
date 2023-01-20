
import * as chokidar from 'chokidar';

export default class GluestackWatcher {
  public isRestarting: boolean = false;
  private watcher: chokidar.FSWatcher;

  constructor(paths: string[]) {
    this.watcher = chokidar.watch(paths, {
      persistent: true
    });
  }

  public on(event: string, cb: (path: string) => void) {
    this.watcher.on(event, cb);
  }

  public close() {
    this.watcher.close();
  }

  public restart(status: boolean) {
    this.isRestarting = status;
  }

  public getStatus(): boolean {
    return this.isRestarting;
  }
}
