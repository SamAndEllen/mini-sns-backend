const hashtagTableName = 'hashtags';

exports.getHashtags = async (ctx) => {
    const [result] = await ctx.state.db.query(`SELECT * FROM ${hashtagTableName}`);

    return result;
};

exports.getHashtagByTag = async (ctx, param) => {
    const [result] = await ctx.state.db.query(`SELECT * FROM ${hashtagTableName} WHERE hashtag = '${param.hashtag}'`);

    return result;
};

exports.setHashTag = async (ctx, param) => {
    const [result] = await ctx.state.db.query(
    `
        INSERT IGNORE INTO ${hashtagTableName} (hashtag, member_id)
        VALUES ('${param.hashtag}', ${param.member_id})
    `);
    return result;
}