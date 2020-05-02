const feedTableName = 'feeds';
const feedHashtagTableName = 'feeds_hashtags';
const hashtagTableName = 'hashtags';
const feedLikeTableName = 'feeds_likes';

const hashtagService = require('../hashtags/services');

exports.getFeeds = async (ctx) => {
    const [result] = await ctx.state.db.query(`SELECT * FROM ${feedTableName}`);
    return result;
};

exports.getFeedsByHashTag = async (ctx, param) => {
    const [result] = await ctx.state.db.query(
        `
            SELECT feeds.* FROM
                ${feedTableName} feeds,
                ${feedHashtagTableName} feeds_hashtags,
                ${hashtagTableName} hashtags
            WHERE feeds.id = feeds_hashtags.feed_id
            AND feeds_hashtags.hashtag_id = hashtags.id
            AND hashtag = '${param.hashtag}'
        `
    );
    return result;
}

exports.setFeed = async (ctx, param) => {
    const [result] = await ctx.state.db.query(
    `
        INSERT INTO ${feedTableName} (contents, member_id)
        VALUES ('${param.contents}', ${param.member_id})
    `);

    const feedId = result.insertId;

    param.hashtags.map(async hashtag => {
        await hashtagService.setHashTag(ctx, { hashtag, member_id: param.member_id });
        const [hashtags] = await hashtagService.getHashtagByTag(ctx, { hashtag });
        await ctx.state.db.query(
        `
            INSERT INTO ${feedHashtagTableName} (feed_id, hashtag_id)
            VALUES ('${feedId}', ${hashtags.id})
        `);
    });

    return result;
}

exports.getFeedLike = async (ctx, param) => {
    const [result] = await ctx.state.db.query(
    `
        SELECT * FROM ${feedLikeTableName} WHERE feed_id = ${param.feed_id} AND member_id = ${param.member_id}
    `);

    return result;
}

exports.setFeedLike = async (ctx, param) => {
    const [result] = await ctx.state.db.query(
    `
        INSERT INTO ${feedLikeTableName} (feed_id, member_id) VALUES (${param.feed_id}, ${param.member_id})
        ON DUPLICATE KEY UPDATE
        deleted_at = IF(isnull(deleted_at), NOW(), null);
    `);

    return result;
}

exports.addTotalLikes = async (ctx, param) => {
    const [result] = await ctx.state.db.query(
    `
        UPDATE ${feedTableName} SET total_likes = total_likes + 1
        WHERE id = ${param.feed_id}
    `);

    return result;
}


exports.removeTotalLikes = async (ctx, param) => {
    const [result] = await ctx.state.db.query(
    `
        UPDATE ${feedTableName} SET total_likes = total_likes - 1
        WHERE id = ${param.feed_id}
    `);

    return result;
}
