import Article from "../database/models/article"

const findAllArticles = async () => {
    return Article.find().populate('author')
}

export default {
    findAllArticles
}