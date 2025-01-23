import express from 'express'
import bodyValidation from '../middlewares/bodyValidation'
import { inquirySchema, updateInquirySchema } from '../validations/inquiryVlidation'
import inquirycontroller from '../controllers/inquirycontroller';
import { userAuthorization } from '../middlewares/authorization';
import { checkInquiryExist } from '../middlewares/inquiryMiddleware';

const inquiryRoute = express.Router();

inquiryRoute.post("/create-inquiry", bodyValidation(inquirySchema), inquirycontroller.createInquiry)
inquiryRoute.get("/get-all-inquiries", userAuthorization(["Admin"]), inquirycontroller.getAllInquiries)
inquiryRoute.patch("/update-status/:id", userAuthorization(["Admin"]), bodyValidation(updateInquirySchema), checkInquiryExist, inquirycontroller.updateInquiry )

export default inquiryRoute