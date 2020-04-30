const Router = require('koa-router');
const feedAPI = new Router();

const feedService = require('./services');
const memberService = require('../members/services');

const Joi = require('joi');

const needAuthorize = require('../../lib/needAuthorize');

feedAPI.get('/', needAuthorize, async (ctx, next) => {
    const { hashtag } = ctx.request.query;

    let result = null;
    if (!hashtag) result = await feedService.getFeeds(ctx);
    else result = await feedService.getFeedsByHashTag(ctx, { hashtag });

    result = await Promise.all(
        result.map(async feed => {
            const members = await memberService.getMember(ctx, { id: feed.member_id });
            const feedLikes = await feedService.getFeedLike(ctx, { feed_id: feed.id, member_id: ctx.request.user.userID });

            return {
                ...feed,
                user_name: members[0].name,
                feedLikes: !!(feedLikes.length > 0 && feedLikes[0].deleted_at) ? true : false
            };
        })
    );

    ctx.body = result;
});

feedAPI.post('/', needAuthorize, async (ctx, next) => {
    let param = ctx.request.body;
    param = { ...param, hashtags: [], member_id: ctx.request.user.userID };

    const schema = Joi.object().keys({
        contents: Joi.string().required(),
        hashtags: Joi.array(),
        member_id: Joi.number().required()
    });

    const paramCheck = Joi.validate(param, schema);
    if (paramCheck.error) {
        ctx.status = 400;
        return;
    }

    param.contents = param.contents.replace(/#([0-9a-zA-Z가-힣]*)+/gm, function(hashtag) {
        param.hashtags.push(hashtag.substring(1));
        return '';
    }).trim();

    const result = await feedService.setFeed(ctx, param);
    ctx.body = result;
});

/**
 * like
 */
feedAPI.post('/:feed_id', needAuthorize, async (ctx, next) => {
    let param = ctx.params;
    param = { ...param, member_id: ctx.request.user.userID };

    const schema = Joi.object().keys({
        feed_id: Joi.string().required(),
        member_id: Joi.number().required()
    });

    const paramCheck = Joi.validate(param, schema);
    if (paramCheck.error) {
        ctx.status = 400;
        return;
    }

    const result = await feedService.setFeedLike(ctx, param);
    ctx.body = result;
});

module.exports = feedAPI;