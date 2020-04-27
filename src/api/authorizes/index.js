const Router = require('koa-router');
const authorizeAPI = new Router();

const Joi = require('joi');
const { generateToken } = require('../../lib/token');
const memberService = require('../members/services');

authorizeAPI.post('/login', async (ctx, next) => {
    const param = ctx.request.body;

    const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().required()
    });

    const paramCheck = Joi.validate(param, schema);
    if (paramCheck.error) {
        ctx.status = 400;
        return;
    }

    const emailValidation = await memberService.getMemberByEmail(ctx, param);
    
    if (emailValidation.length <= 0) {
        ctx.status = 500;
        ctx.body = {
            error: `Email doesn't exist.`
        };
        return;
    }

    const passwordValidation = await memberService.getMemberByEmailAndPassword(ctx, param);

    if (passwordValidation.length <= 0) {
        ctx.status = 500;
        ctx.body = {
            error: 'Wrong password.'
        };
        return;
    }

    const token = await generateToken({ userName: 'NaRae Jo'}, 'user');
    ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    });
    
    ctx.body = {
        message: 'Login Success'
    };
});

authorizeAPI.post('/logout', async (ctx, next) => {
    ctx.cookies.set('access_token', null);
    ctx.body = {
        message: 'Logout Success'
    };
});

module.exports = authorizeAPI;