import express from 'express'
import workerscontroller, { requestPasswordReset, resetPassword } from '../controllers/workerscontroller'
import { createUserSchema, 
    disableUserSchema,
    updateRoleSchema,
    updateUserSchema
 } from '../validations/workersValidations'
import bodyValidation from '../middlewares/bodyValidation'
import { userAuthorization } from '../middlewares/authorization'
import { isWorkerExist, perseQueryParams, validateResetRequest } from '../middlewares/workersMiddleware'
import { validateToken } from '../repository/workersRepositories'


const workersRoute = express.Router();

workersRoute.post("/create-user", userAuthorization(["admin"]),
    bodyValidation(createUserSchema), 
    workerscontroller.createUserController
 );

 workersRoute.get("/get-all-user", 
    isWorkerExist,workerscontroller.getAllWorkers, perseQueryParams,
    userAuthorization(["admin"])
);

workersRoute.put("/disable-user/:userId", 
    userAuthorization(["admin"]),
    bodyValidation(disableUserSchema),
    workerscontroller.disableUserController
);

workersRoute.put("/enable-user/:userId/enable",
    workerscontroller.enableUserController,
    userAuthorization(["admin"],
    )
);

workersRoute.delete("/delete-user/:userId", 
    workerscontroller.deleteUserController,
    userAuthorization(["admin"])
);

workersRoute.put("/update-user/:userId",
    bodyValidation(updateUserSchema),
    workerscontroller.updateUserController
);

workersRoute.post("/request-reset/:userId", validateResetRequest,requestPasswordReset);
workersRoute.post("/reset-password/:userId", validateResetRequest, resetPassword);

workersRoute.put("/changing-role/:userId",
    bodyValidation(updateRoleSchema),
    workerscontroller.updateUserRoleCotroller,
    userAuthorization(["admin"]),

    )
export default workersRoute