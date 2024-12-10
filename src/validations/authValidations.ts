import Joi from "joi";

export const userLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()

})
