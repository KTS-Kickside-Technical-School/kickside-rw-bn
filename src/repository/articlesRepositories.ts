import Article from "../database/models/article"

const findAllArticles = async () => {
    return Article.find();
}

export default {
    findAllArticles
}