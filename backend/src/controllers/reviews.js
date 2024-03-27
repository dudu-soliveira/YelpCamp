const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
  const { review } = req.body;
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const newReview = new Review(review);
  newReview.author = req.user._id;
  campground.reviews.push(newReview);
  await newReview.save();
  await campground.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.destroyReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Deleted review!");
  res.redirect(`/campgrounds/${id}`);
};
