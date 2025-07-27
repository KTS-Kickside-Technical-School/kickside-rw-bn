import {  Response, NextFunction } from "express";
import articlesRepositories from "../repository/articlesRepositories"
import mongoose from "mongoose";

export const isArticleExists = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id = req.params.id || req.body.article;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid parameters"
            });
        }

        const article = await articlesRepositories.findArticleByAttribute("_id", id);
        if (!article) {
            return res.status(404).json({
                status: 404,
                message: "Article not found"
            });
        }

        req.article = article;

        const comments = await isArticleHaveComments(article._id);
        req.comments = comments;

        return next();
    } catch (error) {
        console.error("Error in isArticleExists middleware:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const isArticleExistsBySlug = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const slug = req.params.slug

        const article = await articlesRepositories.findArticleByAttribute("slug", slug);
        if (!article) {
            return res.status(404).json({
                status: 404,
                message: "Article not found"
            });
        }

        req.article = article;

        const comments = await isArticleHaveComments(article._id);
        req.comments = comments;

        return next();
    } catch (error) {
        console.error("Error in isArticleExists middleware:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const isArticlesExistsByCategory = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    const { category } = req.params
    if (!category) {
        return res.status(400).json({
            status: 400,
            message: "Category is required"
        })
    };
    const articles = await articlesRepositories.findArticlesByAttribute("category", category)
    if (!articles || articles.length === 0) {
        return res.status(404).json({
            status: 404,
            message: `No articles found for: ${category}`
        })
    }
    req.articles = articles
    next();
}

export const isArticleHaveComments = async (article: any) => {
    const comments = await articlesRepositories.findArticleComments(article);
    return comments
}