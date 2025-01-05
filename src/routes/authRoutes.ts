import express from 'express';
import { isUserExists } from '../middlewares/authMiddleware';
import bodyValidation from '../middlewares/bodyValidation';
import { forgotPasswordSchema, resetPasswordSchema, userLoginSchema } from '../validations/authValidations';
import authControllers from '../controllers/authControllers';

const authRoute = express.Router();

authRoute.post("/login", bodyValidation(userLoginSchema), isUserExists, authControllers.userLogin);

authRoute.post("/forgot-password", bodyValidation(forgotPasswordSchema),isUserExists, authControllers.forgotPassword)
authRoute.post("/reset-password", bodyValidation(resetPasswordSchema), authControllers.resetPassword)

export default authRoute