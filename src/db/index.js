const mysql = require('mysql2/promise');

const {
  DB_HOST: host,
  DATABASE: database,
  USERNAME: user,
  PASSWORD: password,
  DB_CONNECTION_COUNT: connectionLimit
} = process.env;


const db = mysql.createPool({
  host,
  user,
  password,
  database,
  connectionLimit
});

module.exports = async (ctx, next) => {
  try {
    ctx.state.db = await db.getConnection();
    ctx.state.db.connection.config.namedPlaceholders = true;
    await ctx.state.db.query('SET SESSION sql_mode = "TRADITIONAL"');
    await next();
    ctx.state.db.release();
  } catch (e) {
    if (ctx.state.db) ctx.state.db.release();
    throw e;
  }
};