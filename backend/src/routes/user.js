const express = require("express");
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const users = require("../controllers/users");
const catchAsync = require("../utils/catchAsync");

const {
  storeReturnTo,
  validateUser,
  isLoggedIn,
  isUser,
  validateUserEdit,
} = require("../middleware");

const router = express.Router();

router
  .route("/signup")
  .get(users.renderSignup)
  .post(upload.single("picture"), validateUser, catchAsync(users.signup));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

router
  .route("/users/:username")
  .get(isLoggedIn, catchAsync(users.showUser))
  .put(isLoggedIn, isUser, validateUserEdit, catchAsync(users.editUser));

router
  .route("/users/:username/picture")
  .put(
    isLoggedIn,
    isUser,
    upload.single("editPicture"),
    catchAsync(users.editPicture)
  )
  .delete(isLoggedIn, isUser, catchAsync(users.destroyPicture));

module.exports = router;
