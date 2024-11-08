import express from 'express';
import articlesControllers from '../controllers/articlesControllers';
import { isArticleAlreadyExists, isArticleExists } from '../middlewares/articlesMiddleware';
import multerConfig from '../helpers/multer';
import { transformFilesToBody } from '../helpers/transformFilesToBody';
import bodyValidation from '../middlewares/bodyValidation';
import { newArticleSchema } from '../validations/articlesValidations';
import { userAuthorization } from '../middlewares/authorization';

const articlesRoute = express.Router();

articlesRoute.post("/", userAuthorization(["user"]), isArticleAlreadyExists, multerConfig.array("images"), transformFilesToBody, bodyValidation(newArticleSchema), articlesControllers.createNewArticle);
articlesRoute.get("/", articlesControllers.getAllArticles);
articlesRoute.get("/:_id", isArticleExists, articlesControllers.getSingleArticle)

export default articlesRoute;