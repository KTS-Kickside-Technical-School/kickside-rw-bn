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

const getArticleComments = async (article: any) => {
    return ArticleComment.find({ article }).sort({ createdAt: -1 })
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
    getArticleComments,
    findArticlesEditRequests,
    editArticleEditRequest,
    saveArticleComment,
    deleteArticle,
    saveArticleViewsRecord
}