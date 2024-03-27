if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");

const cities = require("./cities.json");
const titles = require("./titles.json");
const images = require("./images.json");
const reviews = require("./reviews.json");
const names = require("./names.json");

const campground_count = 250;
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/YelpCamp";

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected!");
});

const campgrounds = [];

const seed = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  await User.deleteMany({});

  const myUser = new User({ username: "ed", email: "ed@ed.com" });
  await User.register(myUser, "ed");

  const reviewers = [];

  for (let i = 1; i < 6; i++) {
    const reviewer = new User({
      username: `reviewer${i}`,
      email: `reviewer${i}@review.com`,
    });
    reviewers.push(await User.register(reviewer, "123"));
  }

  for (let i = 0; i < campground_count; i++) {
    let username, newUser, registeredUser;
    if (i < 100) {
      username = names[i];
      newUser = new User({ username, email: username + "@gmail.com" });
      registeredUser = await User.register(newUser, username + "123");
    } else if (i < 170) {
      username = names[i % 100];
      registeredUser = await User.findByUsername(username);
    } else if (i < 240) {
      username = names[i % 170];
      registeredUser = await User.findByUsername(username);
    } else {
      registeredUser = await User.findByUsername("ed");
    }
    let imgs;
    if (i < 30) {
      if (i === 0) {
        imgs = [
          images[i],
          images[images.length - 1],
          images[images.length - 2],
        ];
      } else {
        imgs = [images[i], images[images.length - 2 - i]];
      }
    } else {
      imgs = [images[i]];
    }
    const newCampground = new Campground({
      title: titles[i],
      price: parseFloat((Math.random() * 30 + 30).toFixed(2)),
      city: cities[i].city,
      state: cities[i].state,
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae enim iusto repudiandae! Voluptatibus tenetur eius natus. Dolorem voluptatem impedit velit quam eligendi in tenetur facilis provident, sunt pariatur sapiente accusantium!",
      images: imgs,
      author: registeredUser._id,
      geometry: {
        type: "Point",
        coordinates: [cities[i].longitude, cities[i].latitude],
      },
    });
    for (let i = 0; i < 5; i++) {
      const random = Math.floor(Math.random() * 20);
      if (random <= 4) {
        const author = reviewers[random];
        const newReview = new Review(reviews[random]);
        newReview.body = newCampground.title + newReview.body;
        newReview.author = author._id;
        await newReview.save();
        newCampground.reviews.push(newReview);
      }
    }
    campgrounds.push(newCampground);
  }
  await Campground.insertMany(campgrounds);
};

seed().then(() => {
  mongoose.connection.close();
});
