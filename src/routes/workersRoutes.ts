import express from 'express'
import workerscontroller from '../controllers/workerscontroller'
import { createUserSchema } from '../validations/workersValidations'
import bodyValidation from '../middlewares/bodyValidation'
import { userAuthorization } from '../middlewares/authorization'

const workersRoute = express.Router();

workersRoute.post("/create-user", userAuthorization(["admin"]),
    bodyValidation(createUserSchema), 
    workerscontroller.createUserController
 )

export default workersRoute