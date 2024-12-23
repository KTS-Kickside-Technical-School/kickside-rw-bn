import express from 'express'
import workerscontroller from '../controllers/workerscontroller'
import {
    createUserSchema,
    disableUserSchema,
    updateRoleSchema,
    updateUserSchema
} from '../validations/workersValidations'
import bodyValidation from '../middlewares/bodyValidation'
import { userAuthorization } from '../middlewares/authorization'
import {
    isWorkerAlreadyExists,
    isWorkersExists,
    validateResetRequest
} from '../middlewares/workersMiddleware'

const workersRoute = express.Router();

workersRoute.post("/create-user", userAuthorization(["Admin"]),
    // bodyValidation(createUserSchema),
    isWorkerAlreadyExists,
    workerscontroller.createUserController
);

workersRoute.get("/get-all-users", userAuthorization(["Admin"]), isWorkersExists, workerscontroller.getAllWorkers,

);

workersRoute.put("/disable-user/:userId",
    userAuthorization(["Admin"]),
    bodyValidation(disableUserSchema),
    workerscontroller.disableUserController
);

workersRoute.put("/enable-user/:userId/enable",
    workerscontroller.enableUserController,
    userAuthorization(["Admin"],
    )
);

workersRoute.delete("/delete-user/:userId",
    workerscontroller.deleteUserController,
    userAuthorization(["Admin"])
);

workersRoute.put("/update-user/:userId",
    bodyValidation(updateUserSchema),
    workerscontroller.updateUserController
);

workersRoute.post("/request-reset/:userId", validateResetRequest, workerscontroller.requestPasswordReset);
workersRoute.post("/reset-password/:userId", validateResetRequest, workerscontroller.resetPassword);

workersRoute.put("/changing-role/:userId",
    bodyValidation(updateRoleSchema),
    workerscontroller.updateUserRoleCotroller,
    userAuthorization(["Admin"]),

)
export default workersRoute