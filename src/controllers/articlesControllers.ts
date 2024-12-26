import { NextFunction, Request, Response } from "express"
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

const getOwnArticles = async (req: any, res: Response): Promise<any> => {
    try {
        const articles = await articlesRepositories.findArticlesByAttribute("author", req.user._id)
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

const getSingleArticle = async (req: any, res: Response): Promise<any> => {
    try {
        return res.status(200).json({
            status: 200,
            message: "Article retrieved successfully",
            article: req.article
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message
        })
    }
}

const createNewArticle = async (req: any, res: Response): Promise<any> => {
    try {
        req.body.author = req.user._id
        const article = await articlesRepositories.saveArticle(req.body);
        return res.status(201).json({
            status: 201,
            message: "Article created successfully",
            article
        })
    } catch (error: any) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

const requestArticleEditAccess = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = {
            article: req.article._id,
            journalist: req.user._id
        }
        const request = await articlesRepositories.saveArticleEditRequest(data)
        return res.status(201).json({
            status: 201,
            message: "Edit request is sent successfully",
            request
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

const editArticle = async (req: any, res: Response): Promise<any> => {
    try {
        const article = await articlesRepositories.editArticle(req.article._id, req.body);
        return res.status(200).json({
            status: 200,
            message: "Article updated successfully",
            article
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

export default {
    getAllArticles,
    getOwnArticles,
    getSingleArticle,
    createNewArticle,
    requestArticleEditAccess,
    editArticle
}