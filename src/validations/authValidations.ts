import Joi from "joi";

export const userLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().required()
})

export const resetPasswordSchema = Joi.object({
    password: Joi.string().required(),
    token: Joi.string().required()
})

export const logoutSchema = Joi.object({
    token: Joi.string().required()
})