import express from 'express'
import bodyValidation from '../middlewares/bodyValidation'
import { subscribersSchema, unsubscriberSchema } from '../validations/subscribersListValidation'
import subscribersListController from '../controllers/subscribersListController'
import { isSubscriber, isSubscriberExist } from '../middlewares/subscribersListMiddlewares'



const subscribersRoute = express.Router()

subscribersRoute.post("/subscribers-mail", bodyValidation(subscribersSchema), isSubscriberExist,subscribersListController.saveSubscibersController)
subscribersRoute.get("/subscribers-mail/unsubscribe", bodyValidation(unsubscriberSchema), isSubscriber, subscribersListController.unsubscribeController )

export default subscribersRoute