import { title } from "process";
import Article from "../database/models/article"
import ArticleComment from "../database/models/articleComment";
import ArticlesEditRequest from "../database/models/articlesEditRequest";

import articleView from "../database/models/articleView";
import article from "../database/models/article";
import { Promise } from "mongoose";

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

const getArticleComments = async (article: any) => {
    return ArticleComment.find({ article }).sort({ createdAt: -1 })
}

const findArticlesEditRequests = async () => {
    return ArticlesEditRequest.find()
}

const editArticleEditRequest = async (_id: any, data: any) => {
    return await ArticlesEditRequest.findByIdAndUpdate({ _id }, data, { new: true })
}

const saveArticleComment = async (data: any) => {
    return await ArticleComment.create(data)
}

const deleteArticle = async(_id: string) =>{
    return await Article.findByIdAndDelete(_id)
};

const incrementViews = async(_id: string) =>{
    const article = await Article.findById(_id)
    article.views += 1
    return await article.save()
};

const getArticleAnalysis = async () => {
    try {
        const articles = await Article.find();

        if (!Array.isArray(articles) || articles.length === 0) {
            throw new Error("No articles found in the database");
        }

        const analytics = [];
        for (const article of articles) {
            const views = await articleView.find({ article: article._id }).countDocuments();

            analytics.push({
                articleId: article._id,
                title: article.title,
                author: article.author,
                totalViews: views,
            });
        }
        return analytics;
    } catch (error) {
        throw error;
    }
};

const getArticleAnalysisByAuthor = async () => {
    try {
        const viewsByArticles = await articleView.aggregate([
            
            {
                $lookup: {
                    from: "articles",
                    localField: "article",
                    foreignField: "_id",
                    as: "articleDetails",
                },
            },
            {
                $unwind: "$articleDetails",
            },
            
            {
                $lookup: {
                    from: "users",
                    localField: "articleDetails.author",
                    foreignField: "_id",
                    as: "authorDetails",
                },
            },
            {
                $unwind: "$authorDetails",
            },
            
            {
                $group: {
                    _id: {
                        author: "$articleDetails.author",
                        article: "$articleDetails._id",
                    },
                    author: { $first: "$authorDetails" }, 
                    article: { $first: "$articleDetails" }, 
                    viewCountFromLogs: { $sum: 1 }, 
                },
            },
            
            {
                $addFields: {
                    totalViews: {
                        $add: ["$article.views"], 
                    },
                },
            },
            
            {
                $group: {
                    _id: "$_id.author", 
                    author: { $first: "$author" },
                    totalViews: { $sum: "$totalViews" }, 
                    totalArticles: { $sum: 1 },
                    articles: {
                        $push: {
                            articleId: "$article._id",
                            title: "$article.title",
                            views: "$article.views",
                        },
                    },
                },
            },
        
            {
                $project: {
                    _id: 0,
                    author: {
                        id: "$author._id",
                        name: {
                            $concat: ["$author.firstName", " ", "$author.lastName"],
                        },
                        email: "$author.email",
                    },
                    totalViews: 1,
                    totalArticles: 1,
                    articles: 1,
                },
            },
        ]);

        return viewsByArticles;
    } catch (error) {
        console.error("Error in getArticleAnalysisByAuthor:", error.message);
        throw error;
    }
};



export default {
    findAllArticles,
    findPublishedArticles,
    findArticleByAttribute,
    findArticlesByAttribute,
    saveArticle,
    saveArticleEditRequest,
    findArticleEditRequestByAttribute,
    editArticle,
    getArticleComments,
    findArticlesEditRequests,
    editArticleEditRequest,
    saveArticleComment,
    deleteArticle,
    incrementViews,

    getArticleAnalysis,
    getArticleAnalysisByAuthor
}