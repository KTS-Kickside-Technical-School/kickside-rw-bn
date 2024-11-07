import { Request, Response } from "express"
import articlesRepositories from "../repository/articlesRepositories"

const getAllArticles = async (req: Request, res: Response): Promise<any> => {
    try {
        const articles = await articlesRepositories.findAllArticles();
        return res.status(200).json({
            status: 200,
            articles
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

export default {
    getAllArticles
}