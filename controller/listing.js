const Listing  = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
let mapToken =  process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async(req , res)=>{
    const alllistings = await Listing.find({});
    
    res.render("listings/index.ejs",  {alllistings});
};

module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs");
}

module.exports.showRoute = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews" , populate :{path : "author" ,},}).populate("owner");
    if(!listing){
      req.flash("error" , "Listing you are searching is deleted by you!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {listing})
}

module.exports.create = async(req, res ,next) =>{

  let response =  await  geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
  

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image.filename = filename;
     newListing.image.url = url;
    newListing.geometry = (response.body.features[0].geometry);
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success" , "Listing is Created")
    res.redirect("/listings");
}

module.exports.renderEdit = async(req ,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    let listingImageUrl = listing.image.url;
    listingImageUrl.replace("/upload" , "/upload/w_250");

    res.render("listings/edit.ejs" , {listing , listingImageUrl});

    
}

module.exports.update = async(req,res) =>{
        let {id} = req.params;
       let listing  =  await Listing.findByIdAndUpdate(id , {...req.body.listing});

       if(typeof req.file!= "undefined"){
       let url = req.file.path;
       let filename = req.file.filename;
       listing.image.filename = filename;
       listing.image.url = url;
       await listing.save();
       }
      
        req.flash("success" , "Listing is updated")
        res.redirect(`/listings/${id}`);
}

module.exports.destroyRoute = async(req,res) => {
     let {id} = req.params;
     await Listing.findByIdAndDelete(id);
      req.flash("success" , "Listing is Deleted");
     res.redirect("/listings");
}