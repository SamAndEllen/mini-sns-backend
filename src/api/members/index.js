const Router = require('koa-router');
const memberAPI = new Router();

const Joi = require('joi');
const CryptoJS = require("crypto-js");

const stringEnc = (password) => CryptoJS.HmacSHA256(password, process.env.SECRET_KEY).toString(CryptoJS.enc.Base64);

memberAPI.get('/', async (ctx, next) => {
    const [result] = await ctx.state.db.query('SELECT * FROM members_test');
    ctx.body = result;
});

memberAPI.post('/', async (ctx, next) => {
    const param = ctx.request.body;

    const [IDCheck] = await ctx.state.db.query(`
        SELECT * FROM members WHERE email = '${param.email}'
    `);

    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(10).required(),
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

    const passwordEnc = stringEnc(param.password);

    const [result] = await ctx.state.db.query(
    `
        INSERT INTO members (name,email,password,agree_TOS,agree_privacy)
        VALUES ('${param.name}', '${param.email}', '${passwordEnc}', ${param.agreeTOS}, ${param.agreePrivacy});
    `);

    ctx.body = result;
});

module.exports = memberAPI;