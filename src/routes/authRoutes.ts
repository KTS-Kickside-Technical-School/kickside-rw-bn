import express from 'express';
import { isUserExists } from '../middlewares/authMiddleware';
import bodyValidation from '../middlewares/bodyValidation';
import { userLoginSchema } from '../validations/authValidations';
import authControllers from '../controllers/authControllers';

const authRoute = express.Router();

authRoute.post("/login", bodyValidation(userLoginSchema), isUserExists, authControllers.userLogin);

authRoute.post("/forgot-password", authControllers.forgotPassword)
authRoute.post ("/reset-password", authControllers.resetPassword)

export default authRoute