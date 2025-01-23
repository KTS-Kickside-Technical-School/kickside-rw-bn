import express from 'express';
import articlesRoute from './articlesRoutes';
import authRoute from './authRoutes';
import workersRoute from './workersRoutes'; 
import inquiryRoute from './inquiryRoutes';

const indexRoute = express.Router();

indexRoute.use("/auth", authRoute);
indexRoute.use("/articles", articlesRoute);
indexRoute.use("/workers", workersRoute)
indexRoute.use("/inquiry", inquiryRoute);

export default indexRoute;