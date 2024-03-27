const express = require("express");

const reviews = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");

const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

const router = express.Router({ mergeParams: true });

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.destroyReview)
);

module.exports = router;
