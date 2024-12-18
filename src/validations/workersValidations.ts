import Joi from "joi";

export const createUserSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.object({
        type: Joi.string().valid('journalist', 'cheif editor').required(),
    }).required(),
    password: Joi.string().required(),
})

export default {
    createUserSchema
}