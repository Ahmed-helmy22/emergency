import Joi from "joi";
export const updateSchema = Joi.object({
  name: Joi.string().min(20).max(30).required(),
  email: Joi.string().email().min(10).max(30),
  age: Joi.number().min(10).max(120),
});
export const udatePasswordSchema = Joi.object({
  password: Joi.string().min(8).max(20),
});
