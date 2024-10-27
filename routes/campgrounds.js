const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("../schemas");
const Review = require("../models/review");

//========================================================================

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((x) => x.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((x) => x.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
//========================================================================

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    console.log("creatyed", newCamp._id);
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const newCamp = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    console.log(req.params.id);
    const camp = await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    console.log("path");
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    console.log("found", campground);
    res.render("campgrounds/show", { campground });
  })
);

module.exports = router;
