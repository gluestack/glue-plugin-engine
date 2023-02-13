
export const server_domain: string = '.local.gluestack.app';

export const occupiedPorts: number[] = [];
export const getOccupiedPorts = () => occupiedPorts;
export const setOccupiedPorts = (ports: number[]) => occupiedPorts.push(...ports);

export const domainMappings: any = [];
export const getDomainMappings = () => domainMappings;
export const setDomainMappings = (mappings: any) => domainMappings.push(mappings);
