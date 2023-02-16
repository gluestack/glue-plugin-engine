export declare const createTree: (userData: any, depthLevel?: number) => Promise<{
    children: any[];
    name: string;
    addChild(child: any): void;
    removeChild(child: any): void;
}[]>;
