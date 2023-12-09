/**
 * This constant file is similar with `env/index.ts` of server project. It's primary task
 * is load all the environment variables in `.env` file (Root Directory) and store as
 * Javascript Object.
 */

/**
 * The base endpoint of primary API.
 */
export const API_ROOT = import.meta.env.VITE_API_ROOT;