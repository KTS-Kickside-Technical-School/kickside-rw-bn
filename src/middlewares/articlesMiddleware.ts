import { Request, Response, NextFunction } from "express";
import articlesRepositories from "../repository/articlesRepositories"



export const isArticleAlreadyExists = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const article = await articlesRepositories.findArticleByAttribute("title", req.body.title);
        if (article) {
            return res.status(400).json({
                status: 400,
                message: "Article already exists"
            })
        }
        return next();
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

export const isArticleExists = async (req, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id = req.params._id
        const article = await articlesRepositories.findArticleByAttribute("_id", id);
        if (!article) {
            return res.status(404).json({
                status: 404,
                message: "Article not found"
            })
        }
        req.article = article;
        return next();
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}