/*global module*/

const SECTION = 'docs';
const APP_ID = 'api';
const FRONTEND_PORT = 8002;
const API_PORT = 8889;
const routes = {};

routes[`/beta/${SECTION}/${APP_ID}`] = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/${SECTION}/${APP_ID}`]      = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/beta/apps/docs-api`]       = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/apps/docs-api`]            = { host: `http://localhost:${FRONTEND_PORT}` };

routes[`/config`] = { host: `http://localhost:${API_PORT}` };

module.exports = { routes };
