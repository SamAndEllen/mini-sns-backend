require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require("koa-bodyparser");

const db = require('./db');

const app = new Koa();
const router = new Router();

router.get('/', (ctx, next) => {
    ctx.body = '홈';
});

router.get('/members', async (ctx, next) => {
    const [result] = await ctx.state.db.query('SELECT * FROM members');
    ctx.body = result;
});

// middlewares
app
    .use(db)
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(4000, () => {
    console.log('sns server is listening to port 4000');
});