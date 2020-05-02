const hashtagTableName = 'hashtags';
const feedHashtagTableName = 'feeds_hashtags';

exports.getHashtags = async (ctx) => {
    const [result] = await ctx.state.db.query(`SELECT * FROM ${hashtagTableName}`);

    return result;
};

exports.getHashtagByFeedID = async (ctx, param) => {
    const [result] = await ctx.state.db.query(`
        SELECT GROUP_CONCAT(hashtags.hashtag) as hashtags FROM 
        ${feedHashtagTableName} feeds_hashtags,
        ${hashtagTableName} hashtags
        WHERE feeds_hashtags.hashtag_id = hashtags.id
        AND feeds_hashtags.feed_id = ${param.feed_id}
        GROUP BY feeds_hashtags.feed_id
    `);

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