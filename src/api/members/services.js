const CryptoJS = require("crypto-js");
const stringEnc = (text) => CryptoJS.HmacSHA256(text, process.env.ENC_SECRET_KEY).toString(CryptoJS.enc.Base64);

const mebmerTableName = 'members';

exports.getMembers = async (ctx) => {
    const [result] = await ctx.state.db.query(`SELECT * FROM ${mebmerTableName}`);

    return result;
};

exports.getMemberByEmail = async (ctx, param) => {
    const [result] = await ctx.state.db.query(`
        SELECT * FROM ${mebmerTableName} WHERE email = '${param.email}'
    `);

    return result;
};

exports.getMemberByEmailAndPassword = async (ctx, param) => {
    const [result] = await ctx.state.db.query(`
        SELECT * FROM ${mebmerTableName} where email = '${param.email}' and password = '${stringEnc(param.password)}'
    `);

    return result;
}

exports.joinMember = async (ctx, param) => {
    const [result] = await ctx.state.db.query(
    `
        INSERT INTO ${mebmerTableName} (name,email,password,agree_TOS,agree_privacy)
        VALUES ('${param.name}', '${param.email}', '${stringEnc(param.password)}', ${param.agreeTOS}, ${param.agreePrivacy});
    `);

    return result;
}