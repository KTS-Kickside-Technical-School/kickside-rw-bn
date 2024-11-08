import { Request, Response } from "express"
import articlesRepositories from "../repository/articlesRepositories"
import uploadImage from "../helpers/uploadImages";
import mongoose from "mongoose";

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
        const uploadPromises = req.files.map((file) => uploadImage(file))
        const images = await Promise.all(uploadPromises)
        const articleData = {
            ...req.body,
            author: new mongoose.Types.ObjectId(req.user._id),
            image: images[0].secure_url
        }
        const article = await articlesRepositories.saveArticle(articleData);
        return res.status(201).json({
            status: 201,
            message: "Article created successfully",
            article
        })
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

export default {
    getAllArticles,
    getSingleArticle,
    createNewArticle
}