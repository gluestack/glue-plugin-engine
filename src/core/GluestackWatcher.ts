import * as chokidar from 'chokidar';
import directoryTree, { DirectoryTree } from 'directory-tree';

export default class GluestackWatcher {
  public directoryPath: string;
  public trees: DirectoryTree[];

  constructor(directoryPath: string) {
    this.directoryPath = directoryPath;
  }

  watch(): void {
    chokidar.watch(this.directoryPath, {ignored: /^\./, persistent: true})
      .on('add', (path) => {
        console.log(`File ${path} has been added`);
        // Insert the new file in the B+ tree
      })
      .on('change', (path) => {
        console.log(`File ${path} has been changed`);
        // Update the file in the B+ tree
      })
      .on('unlink', (path) => {
        console.log(`File ${path} has been removed`);
        // Remove the file from the B+ tree
      });
  }

  getDirectoryTree(filepath: string): void {
    const tree: DirectoryTree = directoryTree(filepath, {
      extensions: /\.(js|json|ts)$/,
      exclude: [/node_modules/, /^\./]
    });

    this.trees.push(tree);
  }
}
