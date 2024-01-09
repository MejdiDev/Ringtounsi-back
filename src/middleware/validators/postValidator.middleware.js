const Joi = require("joi");

const createPostSchema = Joi.object({
  coachId: Joi.number().integer().required(),
  description: Joi.string().allow(""),
  imageUrl: Joi.string().allow(""),
  videoUrl: Joi.string().allow(""),
  text: Joi.string().allow(""),
});

const updatePostSchema = Joi.object({
  description: Joi.string().allow(""),
  imageUrl: Joi.string().allow(""),
  videoUrl: Joi.string().allow(""),
  text: Joi.string().allow(""),
});

module.exports = { createPostSchema, updatePostSchema };
