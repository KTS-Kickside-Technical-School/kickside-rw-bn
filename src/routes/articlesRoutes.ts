import express from 'express';
import articlesControllers from '../controllers/articlesControllers';
import {
    isArticlesExistsByCategory,
    isArticleExists,
    isArticleExistsBySlug,
} from '../middlewares/articlesMiddleware';
import bodyValidation from '../middlewares/bodyValidation';
import { postArticleComment } from '../validations/articlesValidations';
import { isUserExistByUsername } from '../middlewares/authMiddleware';

const articlesRoute = express.Router();


articlesRoute.get("/get-published-articles", articlesControllers.getPublishedArticles);
articlesRoute.get("/get-single-article/:slug", isArticleExistsBySlug, articlesControllers.getSingleArticle);
articlesRoute.post("/post-comments", bodyValidation(postArticleComment), isArticleExists, articlesControllers.postArticleComment);

articlesRoute.get("/get-articles-by-category/:category", isArticlesExistsByCategory, articlesControllers.getArticlesByCategory)
articlesRoute.get("/get-author-profile/:username", isUserExistByUsername, articlesControllers.getAuthorProfile);
articlesRoute.get("/get-popular-articles", articlesControllers.getPopularArticles);

export default articlesRoute;