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
export const disableUserSchema = Joi.object({
    email: Joi.string().required(),
    disableStatus: Joi.boolean().required(),
    reason: Joi.string().required()
});

export const updateUserSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email:Joi.string().required(),

})

export const updateRoleSchema = Joi.object({
    role: Joi.string().valid('journalist','admin','cheif editor').required()
})
export default {
    createUserSchema,
    disableUserSchema,
    updateUserSchema,
    updateRoleSchema
}