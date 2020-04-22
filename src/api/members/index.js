const Router = require('koa-router');
const memberAPI = new Router();

memberAPI.get('/', async (ctx, next) => {
    const [result] = await ctx.state.db.query('SELECT * FROM members_test');
    ctx.body = result;
});

memberAPI.post('/', async (ctx, next) => {
    const param = ctx.request.body;

    const [IDCheck] = await ctx.state.db.query(`
        SELECT * FROM members_test WHERE email = '${param.email}'
    `);
    
    let errorMessage = '일부 입력되지 않았습니다.';
    if (IDCheck.length > 0) errorMessage = '이메일이 중복됩니다.';

    if (
        param.name === undefined || param.email === undefined || param.password === undefined
        || param.agreeTOS === undefined || param.agreePrivacy === undefined || IDCheck.length > 0
    ) {
        ctx.status = 400;
        ctx.body = {
            result: false,
            errorMessage
        };
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