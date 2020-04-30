const Router = require('koa-router');

const api = new Router();

const memberAPI = require('./members');
const authorizeAPI = require('./authorizes');
const hashtagAPI = require('./hashtags');
const feedAPI = require('./feeds');

api.use('/members', memberAPI.routes());
api.use('/authorizes', authorizeAPI.routes());
api.use('/hashtags', hashtagAPI.routes());
api.use('/feeds', feedAPI.routes());

module.exports = api;