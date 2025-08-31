const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require('../schema.js');
const router = express.Router(); //router object 
// cloudinary
const {storage} = require("../cloudConfig.js");
//multer
 const multer = require('multer')
 const upload = multer({storage});
  //middlewares
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
  //controllers
const listingController = require("../controller/listing.js");



 
//Index route
  router.get("/", wrapAsync(listingController.index));

//New route
   router.get("/new" , isLoggedIn, listingController.renderNewForm)

// show route
router.get("/:id" , wrapAsync(listingController.showRoute));

//create route
router.post("/" ,  upload.single('listing[image][url]'),
    wrapAsync(listingController.create)
)
// router.post("/" , upload.single('listing[image][url]') , (req,res) =>{
//   res.send(req.file);
// })
//edit route
router.get("/:id/edit" ,isLoggedIn,  wrapAsync(listingController.renderEdit))

//update route
router.put("/:id" , isOwner, upload.single('listing[image][url]'), validateListing ,
    wrapAsync(listingController.update)
);

//delete route
router.delete("/:id" ,isLoggedIn,isOwner, wrapAsync(listingController.destroyRoute));


module.exports = router