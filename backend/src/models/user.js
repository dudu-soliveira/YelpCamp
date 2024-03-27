const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const PictureSchema = new Schema({
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

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  picture: {
    type: PictureSchema,
    required: false,
  },
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

module.exports = User;
