const express =require("express");
const router = express.Router();
const Listing =require("../models/listing.js");
const warpAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const {storage} =require("../cloudConfig.js");
const upload = multer({storage});

const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")

router
.route("/")
// Index Route
    .get(warpAsync(listingController.index))
// Create Route
    .post(isLoggedIn,
        upload.single("listing[image]") ,
        validateListing,
        warpAsync(listingController.createLising));
  

// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
.route("/:id")
//Show Route
    .get(warpAsync(listingController.showLising))
// Update Route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,warpAsync(listingController.updateListing))
// Delete Route
    .delete(isLoggedIn,isOwner,warpAsync(listingController.destroyListing));

    // Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,warpAsync(listingController.renderEditForm));

module.exports = router;