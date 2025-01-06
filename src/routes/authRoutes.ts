import express from 'express';
import { isUserExists } from '../middlewares/authMiddleware';
import bodyValidation from '../middlewares/bodyValidation';
import { forgotPasswordSchema, logoutSchema, resetPasswordSchema, userLoginSchema } from '../validations/authValidations';
import authControllers from '../controllers/authControllers';
import { userAuthorization } from '../middlewares/authorization';

const authRoute = express.Router();

authRoute.post("/login", bodyValidation(userLoginSchema), isUserExists, authControllers.userLogin);

authRoute.post("/forgot-password", bodyValidation(forgotPasswordSchema), isUserExists, authControllers.forgotPassword)
authRoute.post("/reset-password", bodyValidation(resetPasswordSchema), authControllers.resetPassword)

authRoute.post("/logout", userAuthorization(["Admin", "Journalist", "Editor"]), authControllers.userLogout)
export default authRoute