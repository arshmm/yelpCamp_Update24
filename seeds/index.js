const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const price = Math.floor(Math.random() * 20) + 10;
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      author: "6727d3cc8d4470c4a5ed627d",
      price,
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique, deserunt laboriosam incidunt alias ipsam, neque, illum nostrum aspernatur facere eos fuga voluptatibus voluptates dignissimos cum assumenda sunt temporibus sed? Natus!",
      images: [
        {
          url: "https://res.cloudinary.com/drrl50eau/image/upload/v1730825682/yelp-camp/nzqdbk7e4gvmkriqcdla.jpg",
          filename: "yelp-camp/nzqdbk7e4gvmkriqcdla",
        },
        {
          url: "https://res.cloudinary.com/drrl50eau/image/upload/v1730825683/yelp-camp/rlb3np7cwamyedio7g0p.jpg",
          filename: "yelp-camp/rlb3np7cwamyedio7g0p",
        },
      ],
      geometry: { type: "Point", coordinates: [72.663348, 23.24422] },
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
