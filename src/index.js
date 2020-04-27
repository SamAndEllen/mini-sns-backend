require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require("koa-bodyparser");
const cors = require('koa2-cors');

const db = require('./db');
const api = require('./api');
const { jwtMiddleware } = require('./lib/token');

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

const corsConfig = {
    credentials: true,
    allowMethods: ['GET', 'POST', 'PATHCH', 'DELETE', 'PUT', 'HEAD'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposeHeaders: ['Content-Length', 'Date']
};

// middlewares
app
    .use(cors(corsConfig))
    .use(jwtMiddleware)
    .use(db)
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(4000, () => {
    console.log('sns server is listening to port 4000');
});