import express from 'express';
import articlesControllers from '../controllers/articlesControllers';

const articlesRoute = express.Router();

articlesRoute.get("/", articlesControllers.getAllArticles);

export default articlesRoute;