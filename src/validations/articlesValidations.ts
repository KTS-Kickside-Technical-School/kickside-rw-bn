import Joi from "joi";

export const newArticleSchema = Joi.object({
    title: Joi.string().required(),
    images: Joi.array().items(Joi.string()).required(),
    content: Joi.string().required(),
    category: Joi.string().required().valid("Tech", "Sports", "Bizz")
});
