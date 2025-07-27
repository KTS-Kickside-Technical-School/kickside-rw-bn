import express from 'express';
import articlesRoute from './articlesRoutes';
import inquiryRoute from './inquiryRoutes';
import subscribersRoute from './subscribersListRoutes';

const indexRoute = express.Router();

indexRoute.use("/articles", articlesRoute);
indexRoute.use("/inquiry", inquiryRoute);
indexRoute.use("/subscribers", subscribersRoute)

export default indexRoute;