require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require("koa-bodyparser");

const db = require('./db');
const api = require('./api');

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

// middlewares
app
    .use(db)
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(4000, () => {
    console.log('sns server is listening to port 4000');
});