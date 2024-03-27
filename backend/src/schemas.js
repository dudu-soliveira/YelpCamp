const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");
const states = require("./utils/states");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().min(0).required(),
    city: Joi.string().required().escapeHTML(),
    state: Joi.string()
      .valid(...states)
      .required()
      .escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().integer().min(1).max(5).required(),
  }).required(),
});

module.exports.userSchema = Joi.object({
  username: Joi.string().required().escapeHTML(),
  email: Joi.string().email().required().escapeHTML(),
  password: Joi.string().required().escapeHTML(),
});

module.exports.userEditSchema = Joi.object({
  email: Joi.string().email().escapeHTML(),
  password: Joi.string().escapeHTML(),
});
