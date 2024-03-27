const Campground = require("./models/campground");
const Review = require("./models/review");
const User = require("./models/user");

const ExpressError = require("./utils/expressError");
const {
  campgroundSchema,
  reviewSchema,
  userSchema,
  userEditSchema,
} = require("./schemas");

const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const msg = error.details.map((e) => e.message).join(",");
      throw new ExpressError(400, msg);
    } else {
      next();
    }
  };
};

module.exports.validateCampground = validateSchema(campgroundSchema);
module.exports.validateReview = validateSchema(reviewSchema);
module.exports.validateUser = validateSchema(userSchema);
module.exports.validateUserEdit = validateSchema(userEditSchema);

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isCampgroundAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Cannot find that review!");
    return res.redirect(`/campgrounds/${id}`);
  }
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isUser = async (req, res, next) => {
  const { username } = req.params;
  if (username !== req.user.username) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect("/campgrounds");
  }
  next();
};

module.exports.validateImageEdit = async (req, res, next) => {
  const { deleteImages } = req.body;
  const { id } = req.params;
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  const campground = await Campground.findById(id);

  const isDeleteAll =
    deleteImages.length === campground.images.length &&
    deleteImages.every((e, i) => e === campground.images[i]["filename"]);

  if (isDeleteAll && !imgs.length) {
    next(new ExpressError(400, '"images" is not allowed to be empty'));
    return;
  }
  next();
};
