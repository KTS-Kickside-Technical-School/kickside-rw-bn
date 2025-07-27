import express from 'express'
import bodyValidation from '../middlewares/bodyValidation'
import { inquirySchema } from '../validations/inquiryVlidation'
import inquirycontroller from '../controllers/inquirycontroller';

const inquiryRoute = express.Router();

inquiryRoute.post("/create-inquiry", bodyValidation(inquirySchema), inquirycontroller.createInquiry)

export default inquiryRoute