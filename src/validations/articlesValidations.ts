import Joi from "joi";

export const newArticleSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    coverImage: Joi.string(),
    category: Joi.string().required()
});
