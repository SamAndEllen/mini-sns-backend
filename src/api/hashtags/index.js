const Router = require('koa-router');
const hashtagAPI = new Router();

const hashtagService = require('./services');

const Joi = require('joi');

const needAuthorize = require('../../lib/needAuthorize');

hashtagAPI.get('/', needAuthorize, async (ctx, next) => {
    const param = ctx.request.query;
    const result = await hashtagService.getHashtagByTag(ctx, param);
    ctx.body = result;
});

hashtagAPI.post('/', needAuthorize, async (ctx, next) => {
    let param = ctx.request.body;
    param = { ...param, member_id: ctx.request.user.userID };

    const schema = Joi.object().keys({
        hashtag: Joi.string().required(),
        member_id: Joi.number().required()
    });

    const paramCheck = Joi.validate(param, schema);
    if (paramCheck.error) {
        ctx.status = 400;
        return;
    }

    const result = await hashtagService.setHashTag(ctx, param);
    ctx.body = result;
});

module.exports = hashtagAPI;