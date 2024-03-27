const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");

const {
  isLoggedIn,
  validateCampground,
  isCampgroundAuthor,
  validateImageEdit,
} = require("../middleware");

const router = express.Router();

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("images"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isCampgroundAuthor,
    upload.array("images"),
    validateCampground,
    validateImageEdit,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(
    isLoggedIn,
    isCampgroundAuthor,
    catchAsync(campgrounds.destroyCampground)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isCampgroundAuthor,
  catchAsync(campgrounds.getEditForm)
);

module.exports = router;
