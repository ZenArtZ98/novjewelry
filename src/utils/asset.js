/** Respect Vite's base path when deploying into a subdirectory. */
export const asset = (path) => import.meta.env.BASE_URL + path;
