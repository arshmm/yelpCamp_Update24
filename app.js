const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const joi = require("joi");

const path = require("path");
const catchAsync = require("./utils/catchAsync");
//==================================Models==================================================================
const Campground = require("./models/campground");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema } = require("./schemas");

//====================================================================================================
const app = express();
//==================================DB Configuration==================================================================
mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.on("open", () => {
  console.log("Database connected");
});

//==================================App Configuration==================================================================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((x) => x.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//====================================================================================================
app.get("/", (req, res) => {
  res.render("home");
});
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    console.log("creatyed", newCamp._id);
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const newCamp = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    console.log(req.params.id);
    const camp = await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    console.log("found", campground);
    res.render("campgrounds/show", { campground });
  })
);

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});
app.use((err, req, res, next) => {
  const { message = "Something went wrong", statusCode = 500 } = err;
  res.status(statusCode).render("errors", { err });
});

app.listen(3000, () => {
  console.log("service running on http://localhost:3000");
});
