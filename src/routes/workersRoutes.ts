import express from 'express'
import workerscontroller from '../controllers/workerscontroller'

import {
    createUserSchema,
    disableUserSchema,
    updateRoleSchema,
    updateUserSchema,
    updateProfileSchema
} from '../validations/workersValidations'
import bodyValidation from '../middlewares/bodyValidation'
import { userAuthorization } from '../middlewares/authorization'
import {
    isWorkerAlreadyExists
} from '../middlewares/workersMiddleware'
import { isUserExistsById } from '../middlewares/authMiddleware'

const workersRoute = express.Router();

workersRoute.post("/create-user", userAuthorization(["Admin"]), bodyValidation(createUserSchema), isWorkerAlreadyExists, workerscontroller.createUserController);
workersRoute.get("/get-all-users", userAuthorization(["Admin"]), workerscontroller.getAllWorkers);
workersRoute.put("/disable-user", userAuthorization(["Admin"]), bodyValidation(disableUserSchema), isUserExistsById, workerscontroller.disableUser);
workersRoute.put("/enable-user/:userId", userAuthorization(["Admin"]), isUserExistsById, workerscontroller.enableUser);
workersRoute.put("/update-user", userAuthorization(["Admin"]), bodyValidation(updateUserSchema), isUserExistsById, workerscontroller.updateUser);
workersRoute.put("/update-user-role", userAuthorization(["Admin"]), bodyValidation(updateRoleSchema), isUserExistsById, workerscontroller.updateUserRole);

workersRoute.get("/get-profile", userAuthorization(["Admin", "Journalist", "Editor"]), workerscontroller.getUserProfile);
workersRoute.put("/update-profile", userAuthorization(["Admin", "Editor", "Journalist"]), bodyValidation(updateProfileSchema), workerscontroller.updateUserProfile )



export default workersRoute