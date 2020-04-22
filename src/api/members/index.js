const Router = require('koa-router');

const memberAPI = new Router();

memberAPI.get('/', async (ctx, next) => {
    const [result] = await ctx.state.db.query('SELECT * FROM members_test');
    ctx.body = result;
});

memberAPI.post('/', async (ctx, next) => {
    const param = ctx.request.body;
    ctx.body = param;
});

module.exports = memberAPI;