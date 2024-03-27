const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { cloudinary } = require("../config/cloudinary");
const Review = require("./review");
const states = require("../utils/states");

const ImageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  _id: false,
});

const GeometrySchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  _id: false,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    geometry: {
      type: GeometrySchema,
      required: true,
    },
    images: {
      type: [ImageSchema],
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    state: {
      type: String,
      enum: states,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  opts
);

CampgroundSchema.virtual("location")
  .get(function () {
    return `${this.city}, ${this.state}`;
  })
  .set(function (loc) {
    const city = loc.substring(0, loc.indexOf(","));
    const state = loc.substring(loc.indexOf(",") + 2);
    return this.set({ city, state });
  });

CampgroundSchema.virtual("properties").get(function () {
  return { title: this.title, id: this._id, description: this.description };
});

CampgroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
    for (let img of doc.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
});

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
