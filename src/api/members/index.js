const Router = require('koa-router');
const memberAPI = new Router();

const Joi = require('joi');

memberAPI.get('/', async (ctx, next) => {
    const [result] = await ctx.state.db.query('SELECT * FROM members_test');
    ctx.body = result;
});

memberAPI.post('/', async (ctx, next) => {
    const param = ctx.request.body;

    const [IDCheck] = await ctx.state.db.query(`
        SELECT * FROM members_test WHERE email = '${param.email}'
    `);

    const schema = Joi.object().keys({
        name: Joi.string().alphanum().min(3).max(10).required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().required(),
        agreeTOS: Joi.boolean().required(),
        agreePrivacy: Joi.boolean().required()
    });

    const paramCheck = Joi.validate(param, schema);

    if (paramCheck.error || IDCheck.length > 0) {
        ctx.status = 400;
        return;
    }

    const [result] = await ctx.state.db.query(
    `
        INSERT INTO mini_sns.members_test (name,email,password,agree_TOS,agree_privacy)
        VALUES ('${param.name}', '${param.email}', '${param.password}', ${param.agreeTOS}, ${param.agreePrivacy});
    `);

    ctx.body = result;
});

module.exports = memberAPI;