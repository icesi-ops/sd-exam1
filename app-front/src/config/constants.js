// Handling environment variables in constants.js
window._env_ = window._env_ || {};
export const API_URL = import.meta.env.API_URL ?? window._env_.API_URL;
export const API_CONSUL= import.meta.env.API_CONSUL ?? window._env_.API_CONSUL;