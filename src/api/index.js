const Router = require('koa-router');

const api = new Router();

const memberAPI = require('./members');

api.use('/members', memberAPI.routes());

module.exports = api;