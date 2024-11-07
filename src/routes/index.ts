import express from 'express';
import articlesRoute from './articlesRoutes';
import authRoute from './authRoutes';

const indexRoute = express.Router();

indexRoute.use("/auth", authRoute);
indexRoute.use("/articles", articlesRoute);

export default indexRoute;