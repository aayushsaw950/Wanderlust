const Listing = require('../models/listing');
const Review = require("../models/review.js");

module.exports.create = async(req,res) =>{
   let listing =  await Listing.findById(req.params.id);
   const newReview = new Review(req.body.review);
   newReview.author = req.user._id;
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
    req.flash("success" , "Review is updated")
   res.redirect(`/listings/${listing._id}`); 
}

module.exports.destroyReview = async (req , res) => {
    let {id , review_Id} = req.params;
    console.log(id);
    console.log(review_Id);
    await Listing.findByIdAndUpdate(id ,{$pull : {reviews : review_Id}})
    await Review.findByIdAndDelete(review_Id);
    req.flash("success" , "Review is Deleted")
    res.redirect(`/listings/${id}`);
}