import Article from "../database/models/article";
import User from "../database/models/user";

const findUserByUsernames = async (username) => {
    return await User.findOne(
        {
            username,
            isDisabled: false
        });
};

const findArticlesByAuthor = async (authorId) => {
    return await Article.find({ author: authorId, status: "published" })
        .sort({ createdAt: -1 });
};

const findRelatedJournalists = async (currentUserId) => {
    return await User.find({ _id: { $ne: currentUserId }, isDisabled: false })
        .select("firstName lastName bio username profile")
        .limit(5)
};

export default {
    findRelatedJournalists,
    findArticlesByAuthor,
    findUserByUsernames
}