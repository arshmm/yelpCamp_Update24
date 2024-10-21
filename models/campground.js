const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CampgroundsSchema = new Schema({
  title: String,
  price: String,
  descriptio: String,
  location: String,
});

module.exports = mongoose.model("Campgrounds", CampgroundsSchema);
