const Router = require('koa-router');

const api = new Router();

const memberAPI = require('./members');
const authorizeAPI = require('./authorizes');

api.use('/members', memberAPI.routes());
api.use('/authorizes', authorizeAPI.routes());

module.exports = api;