import Article from "../database/models/article"

const findAllArticles = async () => {
    return Article.find({ status: 'published' })
        .populate('author')
        .sort({ createdAt: -1 });
}


const findArticleByAttribute = async (key: any, value: String) => {
    return Article.findOne({ [key]: value }).populate('author')
}

const saveArticle = async (data: any) => {
    return await Article.create(data)
}

export default {
    findAllArticles,
    findArticleByAttribute,
    saveArticle
}