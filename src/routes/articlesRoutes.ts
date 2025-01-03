import express from 'express';
import articlesControllers from '../controllers/articlesControllers';
import {
    isArticleAlreadyExists,
    isArticleEditable,
    isArticleEditRequestAlreadyExists,
    isArticleEditRequestExistsAndPending,
    isArticleExists,
    isArticleExistsBySlug,
    isArticleOwned
} from '../middlewares/articlesMiddleware';
import bodyValidation from '../middlewares/bodyValidation';
import { editArticleSchema, newArticleSchema, postArticleComment } from '../validations/articlesValidations';
import { userAuthorization } from '../middlewares/authorization';

const articlesRoute = express.Router();

articlesRoute.post("/create-article", userAuthorization(["Editor", "Journalist", "Admin"]), bodyValidation(newArticleSchema), isArticleAlreadyExists, articlesControllers.createNewArticle);
articlesRoute.get("/get-own-articles", userAuthorization(["Editor", "Journalist","Admin"]), articlesControllers.getOwnArticles);
articlesRoute.get("/get-own-single-article/:id", userAuthorization(["Editor", "Journalist","Admin"]), isArticleExists, isArticleOwned, articlesControllers.getSingleArticle);
articlesRoute.post("/request-edit-access/:id", userAuthorization(["Journalist"]), isArticleExists, isArticleOwned, isArticleEditRequestAlreadyExists, articlesControllers.requestArticleEditAccess);
articlesRoute.put("/journalist-edit-article/:id", userAuthorization(["Journalist"]), bodyValidation(editArticleSchema), isArticleExists, isArticleOwned, isArticleEditable, articlesControllers.editArticle);

articlesRoute.get("/get-all-articles", userAuthorization(["Editor", "Admin"]), articlesControllers.getAllArticles);
articlesRoute.put("/toggle-article-publish/:id", userAuthorization(["Editor", "Admin"]), isArticleExists, articlesControllers.toggleArticlePublish);
articlesRoute.put("/editor-edit-article/:id", userAuthorization(["Editor", "Admin"]), bodyValidation(editArticleSchema), isArticleExists, articlesControllers.editArticle);
articlesRoute.get("/get-all-articles-edit-requests", userAuthorization(["Editor", "Admin"]), articlesControllers.getAllArticlesEditRequests);
articlesRoute.put("/confirm-edit-request/:id", userAuthorization(["Editor", "Admin"]), isArticleEditRequestExistsAndPending, articlesControllers.approveArticlesEditRequests);

articlesRoute.get("/get-published-articles", articlesControllers.getPublishedArticles);
articlesRoute.get("/get-single-article/:slug", isArticleExistsBySlug, articlesControllers.getSingleArticle);
articlesRoute.post("/post-comments", bodyValidation(postArticleComment), isArticleExists, articlesControllers.postArticleComment);

articlesRoute.delete("/delete-article/:id", isArticleExists, userAuthorization(["Admin"]), articlesControllers.deleteArticle);

export default articlesRoute;