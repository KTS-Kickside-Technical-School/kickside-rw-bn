import Joi from "joi";

export const createUserSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    email: Joi.string().required(),
    role: Joi.string().valid('Journalist', 'Editor', 'Admin'),
})

export const disableUserSchema = Joi.object({
    _id: Joi.string().required(),
    disableReason: Joi.string().required()
});

export const updateUserSchema = Joi.object({
    _id: Joi.string().required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
})

export const updateRoleSchema = Joi.object({
    _id: Joi.string().required(),
    role: Joi.string().valid('Journalist', 'Editor', 'Admin').required()
})

export const updateProfileSchema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
})