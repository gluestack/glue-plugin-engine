import { GlueStackPlugin } from "src";
export declare const routeGenerate: (program: any, glueStackPlugin: GlueStackPlugin) => Promise<void>;
export declare const metaPlugins: () => Promise<string[]>;
export declare const runner: (glueStackPlugin: GlueStackPlugin, options: any) => Promise<void>;
