const express = require("express");
const router = express.Router({ mergeParams: true });

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const { reviewSchema } = require("../schemas");

const Campground = require("../models/campground");
const Review = require("../models/review");
const {
  validateReview,
  isLoggedin,
  isAuthor,
  isReviewAuthor,
} = require("../middleware");
const { createReview, deleteReview } = require("../controllers/reviews");

//========================================================================

router.post("/", isLoggedin, validateReview, catchAsync(createReview));

router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  catchAsync(deleteReview)
);

module.exports = router;
