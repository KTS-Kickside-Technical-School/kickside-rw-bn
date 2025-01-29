import mongoose from "mongoose";
import Article from "../database/models/article"
import ArticleComment from "../database/models/articleComment";
import ArticlesEditRequest from "../database/models/articlesEditRequest";
import ArticleView from "../database/models/articlesViews";

const findPublishedArticles = async () => {
    return Article.find({ status: 'published' })
        .populate('author')
        .sort({ createdAt: -1 });
}

const findAllArticles = async () => {
    return Article.find()
        .populate('author')
        .sort({ createdAt: -1 });
}

const findArticleByAttribute = async (key: any, value: String) => {
    return Article.findOne({ [key]: value }).populate('author')
}

const findArticlesByAttribute = async (key: any, value: String) => {
    return await Article.find({ [key]: value }).populate('author').sort({ createdAt: -1 });
}

const saveArticle = async (data: any) => {
    return await Article.create(data)
}

const saveArticleEditRequest = async (data: any) => {
    return ArticlesEditRequest.create(data);
}

const findArticleEditRequestByAttribute = async (key: any, value: String) => {
    return ArticlesEditRequest.findOne({ [key]: value });
}

const editArticle = async (_id: String, data: any) => {
    return Article.findByIdAndUpdate({ _id }, data, { new: true })
}

const findArticleComments = async (article: any) => {
    return ArticleComment.find({ article })
}

const findArticlesEditRequests = async () => {
    return ArticlesEditRequest.find().populate('journalist').populate('article').sort({ isAccepted: 1 })
}

const editArticleEditRequest = async (_id: any, data: any) => {
    return await ArticlesEditRequest.findByIdAndUpdate({ _id }, data, { new: true })
}

const saveArticleComment = async (data: any) => {
    return await ArticleComment.create(data)
}

const deleteArticle = async (_id: string) => {
    return await Article.findByIdAndDelete(_id)
};

const saveArticleViewsRecord = async (data: any) => {
    return await ArticleView.create(data)
};

const findArticlesByCategory = async (category: string) => {
    return Article.find({
        category: category,
        status: "published",
    }).populate("author").sort({ createdAt: -1 })
};

const findArticlesByYearAndAttribute = async (key: any, value: String, year: any) => {
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

    const articles = await Article.find({
        [key]: value,
        createdAt: { $gte: startOfYear, $lte: endOfYear }
    })
        .populate("author")
        .sort({ createdAt: -1 });

    return articles;
}

const findMonthlyAnalyticsByYear = async (year: any, userId: any) => {
    try {
        const startOfYear = new Date(`${year}-01-01`);
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

        const monthlyViews = await ArticleView.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $lookup: {
                    from: "articles",
                    localField: "article",
                    foreignField: "_id",
                    as: "articleDetails"
                }
            },
            {
                $unwind: "$articleDetails"
            },
            {
                $match: {
                    "articleDetails.author": new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    views: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        const monthlyComments = await ArticleComment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            {
                $lookup: {
                    from: "articles",
                    localField: "article",
                    foreignField: "_id",
                    as: "articleDetails"
                }
            },
            {
                $unwind: "$articleDetails"
            },
            {
                $match: {
                    "articleDetails.author": new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    comments: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const currentMonth = new Date().getMonth() + 1;

        const formattedData = Array.from({ length: 12 }, (_, index) => {
            const monthIndex = index + 1;

            if (year < new Date().getFullYear()) {
                const viewData = monthlyViews.find(data => data._id === monthIndex);
                const commentData = monthlyComments.find(data => data._id === monthIndex);

                return {
                    month: monthShortNames[index],
                    views: viewData ? viewData.views : 0,
                    comments: commentData ? commentData.comments : 0
                };
            }

            if (monthIndex > currentMonth) {
                return null;
            }

            const viewData = monthlyViews.find(data => data._id === monthIndex);
            const commentData = monthlyComments.find(data => data._id === monthIndex);

            return {
                month: monthShortNames[index],
                views: viewData ? viewData.views : 0,
                comments: commentData ? commentData.comments : 0
            };
        }).filter(item => item !== null);

        return formattedData;
    } catch (error) {
        console.error('Error fetching monthly analytics:', error);
        throw error;
    }
};

const findArticlesTotalComments = async (articles: any[]) => {
    try {
        const commentCounts = await Promise.all(
            articles.map(async (article) => {
                const comments = await findArticleComments(article._id);
                return comments.length;
            })
        );

        const totalComments = commentCounts.reduce((sum, count) => sum + count, 0);
        return totalComments;
    } catch (error) {
        throw error;
    }
};

const findArticlesTotalViews = async (articles: any[]) => {
    try {
        const viewsCounts = await Promise.all(
            articles.map(async (article) => {
                const views = await findArticleViewsByArticleId(article._id);
                return views.length;
            })
        );

        const totalViews = viewsCounts.reduce((sum, count) => sum + count, 0);
        return totalViews;
    } catch (error) {
        throw error;
    }
}

const findArticleViewsByArticleId = async (articleId: number) => {
    return await ArticleView.find({ article: articleId })
}

export default {
    findAllArticles,
    findPublishedArticles,
    findArticleByAttribute,
    findArticlesByAttribute,
    saveArticle,
    saveArticleEditRequest,
    findArticleEditRequestByAttribute,
    editArticle,
    findArticleComments,
    findArticlesEditRequests,
    editArticleEditRequest,
    saveArticleComment,
    deleteArticle,
    saveArticleViewsRecord,
    findArticlesByCategory,
    findArticlesByYearAndAttribute,
    findMonthlyAnalyticsByYear,
    findArticlesTotalComments,
    findArticlesTotalViews
}