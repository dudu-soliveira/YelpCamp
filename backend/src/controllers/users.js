const Campground = require("../models/campground");
const User = require("../models/user");
const { cloudinary } = require("../config/cloudinary");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup", { title: "Sign Up" });
};

module.exports.signup = async (req, res) => {
  try {
    let picture;
    if (req.file) {
      picture = { url: req.file.path, filename: req.file.filename };
    }
    const { username, email, password } = req.body;
    const user = new User({ username, email, picture });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login", { title: "Log In" });
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};

module.exports.showUser = async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findByUsername(username);
  if (!user) {
    req.flash("error", "Cannot find that user!");
    return res.redirect("/campgrounds");
  }
  const campgrounds = await Campground.find({ author: user._id });
  const { email, picture } = user;
  res.render("users/show", {
    email,
    picture,
    username,
    campgrounds,
    title: username,
  });
};

module.exports.editUser = async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findByUsername(username);
  if (!user) {
    req.flash("error", "Cannot find that user!");
    return res.redirect("/campgrounds");
  }
  const { email, oldPassword, newPassword } = req.body;
  if (email) {
    user.email = email;
    if (!newPassword || !oldPassword) {
      user
        .save({ validateBeforeSave: true })
        .then(() => {
          req.flash("success", "Successfully changed email!");
          return res.redirect(`/users/${username}`);
        })
        .catch(() => {
          req.flash("error", "Email already in use!");
          return res.redirect(`/users/${username}`);
        });
    }
  }
  if (newPassword && oldPassword) {
    await user.authenticate(
      oldPassword,
      async function (err, model, passwordError) {
        if (passwordError) {
          req.flash("error", "The given password is incorrect!");
          return res.redirect(`/users/${username}`);
        } else if (model) {
          if (email) {
            user
              .save({ validateBeforeSave: true })
              .then(async function () {
                await model.setPassword(newPassword, function () {
                  req.flash(
                    "success",
                    "Successfully changed password and email!"
                  );
                  return res.redirect(`/users/${username}`);
                });
              })
              .catch(() => {
                req.flash("error", "Email already in use!");
                return res.redirect(`/users/${username}`);
              });
          } else {
            await model.setPassword(newPassword, async function () {
              req.flash("success", "Successfully changed password!");
              await model.save();
              return res.redirect(`/users/${username}`);
            });
          }
        }
      }
    );
  }
};

module.exports.editPicture = async (req, res, next) => {
  let picture = { url: req.file.path, filename: req.file.filename };
  const { username } = req.params;
  const user = await User.findByUsername(username);
  if (!user) {
    req.flash("error", "Cannot find that user!");
    return res.redirect(`/users/${username}`);
  }
  if (user.picture) {
    await cloudinary.uploader.destroy(user.picture.filename);
  }
  user.picture = picture;
  await user.save();
  req.flash("success", "Successfully changed profile picture!");
  return res.redirect(`/users/${username}`);
};

module.exports.destroyPicture = async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findByUsername(username);
  if (!user) {
    req.flash("error", "Cannot find that user!");
    return res.redirect(`/users/${username}`);
  }
  if (!user.picture) {
    req.flash("error", "No profile picture to delete!");
    return res.redirect(`/users/${username}`);
  }
  await cloudinary.uploader.destroy(user.picture.filename);
  user.picture = undefined;
  await user.save();
  req.flash("success", "Successfully deleted profile picture!");
  return res.redirect(`/users/${username}`);
};
