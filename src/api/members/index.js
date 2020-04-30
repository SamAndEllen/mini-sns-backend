const Router = require('koa-router');
const memberAPI = new Router();

const memberService = require('./services');

const Joi = require('joi');

const needAuthorize = require('../../lib/needAuthorize');

memberAPI.get('/', needAuthorize, async (ctx, next) => {
    const result = await memberService.getMembers(ctx);
    ctx.body = result;
});

memberAPI.get('/:id', needAuthorize, async (ctx, next) => {
    const result = await memberService.getMember(ctx, { id: ctx.params.id });
    ctx.body = result;
});

memberAPI.post('/', async (ctx, next) => {
    const param = ctx.request.body;

    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(10).required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().required(),
        agreeTOS: Joi.boolean().required(),
        agreePrivacy: Joi.boolean().required()
    });

    const paramCheck = Joi.validate(param, schema);
    if (paramCheck.error) {
        ctx.status = 400;
        return;
    }

    const IDCheck = await memberService.getMemberByEmail(ctx, param);
    if (IDCheck.length > 0) {
        ctx.status = 409;
        return;
    }

    const result = await memberService.joinMember(ctx, param);
    ctx.body = result;
});

module.exports = memberAPI;