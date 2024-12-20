import { Request, Response, NextFunction } from "express";
import articlesRepositories from "../repository/articlesRepositories"
import mongoose from "mongoose";



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

export const isArticleExists = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;

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
        req.article.comments = comments;

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

export const isArticleOwned = async (req: any, res: any, next: NextFunction): Promise<any> => {
    try {
        const isArticleOwned = req.article.author._id.equals(req.user._id);

        if (!isArticleOwned) {
            return res.status(403).json({
                status: 403,
                message: 'Article not owned by user',
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

export const isArticleEditRequestAlreadyExists = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const editRequest = await articlesRepositories.findArticleEditRequestByAttribute("journalist", req.user._id);

        if (editRequest && editRequest.isAccepted === false) {
            return res.status(400).json({
                status: 400,
                message: "Edit request already exists!"
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

export const isArticleEditable = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (req.article.isEditable === false) {
            return res.status(400).json({
                status: 400,
                message: 'Article is not editable'
            })
        }
        return next();
    } catch (error) {
        res.status(500).json({
            status: 500,
            mmessage: error.message
        })
    }
}

export const isArticleEditRequestExistsAndPending = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid parameters"
            });
        }

        const editRequest = await articlesRepositories.findArticleEditRequestByAttribute("_id", id);
        if (!editRequest) {
            return res.status(404).json({
                status: 404,
                message: "Article edit request not found"
            })
        }
        req.editRequest = editRequest
        return next();

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}
export const isArticleHaveComments = async (article: any) => {
    const comments = await articlesRepositories.getArticleComments(article);
    return comments
}