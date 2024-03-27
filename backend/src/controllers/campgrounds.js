const Campground = require("../models/campground");
const { cloudinary } = require("../config/cloudinary");
const states = require("../utils/states");
const ExpressError = require("../utils/expressError");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds", {
    campgrounds,
    title: "All Campgrounds",
    mapBoxAccessToken: process.env.MAPBOX_TOKEN,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new", { title: "New Campground", states });
};

module.exports.createCampground = async (req, res, next) => {
  const images = req.files;
  if (!images.length) {
    next(new ExpressError(400, '"images" is not allowed to be empty'));
    return;
  }
  const { campground } = req.body;
  const geoData = await geocoder
    .forwardGeocode({
      query: `${campground.city}, ${campground.state}`,
      limit: 1,
    })
    .send();
  const newCampground = new Campground(campground);
  newCampground.geometry = geoData.body.features[0].geometry;
  newCampground.images = images.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCampground.author = req.user._id;
  await newCampground.save();
  req.flash(
    "success",
    `Successfully created campground ${newCampground.title}!`
  );
  res.redirect(`campgrounds/${newCampground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", {
    campground,
    reviews: campground.reviews,
    title: campground.title,
    mapBoxAccessToken: process.env.MAPBOX_TOKEN,
  });
};

module.exports.getEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", {
    campground,
    title: `Edit: ${campground.title}`,
    states,
  });
};

module.exports.updateCampground = async (req, res, next) => {
  const { campground, deleteImages } = req.body;
  const { id } = req.params;
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  const updatedCampground = await Campground.findByIdAndUpdate(
    id,
    {
      ...campground,
      $push: {
        images: { $each: imgs },
      },
    },
    {
      runValidators: true,
    }
  );
  if (deleteImages) {
    await updatedCampground.updateOne({
      $pull: {
        images: { filename: { $in: deleteImages } },
      },
    });
    for (let filename of deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
  }
  req.flash("success", `Successfully edited campground ${campground.title}!`);
  res.redirect(`/campgrounds/${id}`);
};

module.exports.destroyCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash("success", `Deleted campground ${campground.title}!`);
  res.redirect("/campgrounds");
};
