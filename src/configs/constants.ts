/**
 * This file contains all the constants used in the project
 */


/**
 * This function returns an array of all the backend plugins that are used in the project.
 *
 * Note: This function is used in the GluestackEngine.ts file and we are using this function
 * to collect the details of the backend plugins that needs to be added to the engine-up method.
 *
 * @returns {string[]} - Returns an array of all the plugins that are used in the project
 */
export const backendPlugins: string[] = [
  '@gluestack/glue-plugin-postgres',
  '@gluestack/glue-plugin-graphql',
  '@gluestack/glue-plugin-engine',
  '@gluestack/glue-plugin-functions',
  '@gluestack/glue-plugin-functions.action',
  '@gluestack/glue-plugin-auth',
  '@gluestack/glue-plugin-storage',
  '@gluestack/glue-plugin-functions-*'
];

export const noDockerfiles: string[] = [
  '@gluestack/glue-plugin-graphql',
  '@gluestack/glue-plugin-postgres'
];

