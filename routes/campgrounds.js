const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const Campground = require("../models/campground");
const {
  isLoggedin,
  isAuthor,
  validateCampground,
} = require("../middleware.js");
const {
  index,
  renderNewForm,
  createCampground,
  showCampground,
  renderEditForm,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgrounds.js");

router
  .route("/")
  .get(catchAsync(index))
  .post(isLoggedin, validateCampground, catchAsync(createCampground));

router.get("/new", isLoggedin, renderNewForm);

router
  .route("/:id")
  .get(catchAsync(showCampground))
  .put(isLoggedin, isAuthor, validateCampground, catchAsync(updateCampground))
  .delete(isLoggedin, isAuthor, catchAsync(deleteCampground));

router.get("/:id/edit", isLoggedin, isAuthor, catchAsync(renderEditForm));

module.exports = router;
