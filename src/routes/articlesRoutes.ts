import express from 'express';
import articlesControllers from '../controllers/articlesControllers';
import {
    isArticleAlreadyExists,
    isArticleEditable,
    isArticleEditRequestAlreadyExists,
    isArticleExists,
    isArticleOwned
} from '../middlewares/articlesMiddleware';
import bodyValidation from '../middlewares/bodyValidation';
import { editArticleSchema, newArticleSchema } from '../validations/articlesValidations';
import { userAuthorization } from '../middlewares/authorization';

const articlesRoute = express.Router();

articlesRoute.post("/create-article", userAuthorization(["Editor", "Journalist"]), bodyValidation(newArticleSchema), isArticleAlreadyExists, articlesControllers.createNewArticle);
articlesRoute.get("/get-own-articles", userAuthorization(["Editor", "Journalist"]), articlesControllers.getOwnArticles);
articlesRoute.get("/get-own-single-article/:id", userAuthorization(["Editor", "Journalist"]), isArticleExists, isArticleOwned, articlesControllers.getSingleArticle);
articlesRoute.post("/request-edit-access/:id", userAuthorization(["Journalist"]), isArticleExists, isArticleOwned, isArticleEditRequestAlreadyExists, articlesControllers.requestArticleEditAccess);
articlesRoute.put("/journalist-edit-article/:id", userAuthorization(["Journalist"]), bodyValidation(editArticleSchema), isArticleExists, isArticleOwned, isArticleEditable, articlesControllers.editArticle);

articlesRoute.get("/:id", isArticleExists, articlesControllers.getSingleArticle)

export default articlesRoute;