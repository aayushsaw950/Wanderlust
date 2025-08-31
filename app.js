if(process.env.NODE_ENV != "production"){
const dotenv = require('dotenv')
dotenv.config()
}
// console.log(process.env.CLOUD_NAME, process.env.CLOUD_API_KEY, process.env.CLOUD_API_SECRET);


// basic setup  requiring files
const express = require('express'); //done
const app = express();  //done
const mongoose = require('mongoose'); //done
const port = 8080; //done
const Lisitng = require('./models/listing.js'); //done
const path = require('path');  //done
const methodOverride = require("method-override") //done
const ejsmate = require('ejs-mate') //done
const wrapAsync = require("./utils/wrapAsync.js") //done
const ExpressError = require("./utils/ExpressError.js"); //done
const {listingSchema , reviewSchema} = require('./schema.js'); //done
   
   //session and flash
const session = require('express-session') //done
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');// done
   //passport
const passport = require('passport'); //done
const LocalStrategy = require('passport-local'); //done
const User = require("./models/user.js"); //done
//routers
const listingRouter = require("./routes/listing.js");// done
const reviewRouter = require("./routes/review.js"); // done
const userRouter = require("./routes/user.js");
 
  //middlewares
const {isLoggedIn} = require("./middleware.js");

// mongoDB
main().then(() =>{
    console.log("connected to DB")
}).catch((err) =>{
   console.log(err)
});

async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
     await mongoose.connect(process.env.ATLASDB_URL);
}
// session store
const store = MongoStore.create({
    mongoUrl : process.env.ATLASDB_URL,
    crypto: {
    secret: process.env.SECRET
  },
    touchAfter: 24 * 3600 // time period in seconds,  A session has been touched (but not modified)
})

store.on("error" , ()=>{
    console.log("some error occured in  mongo session store" , err);
})


//express-session options
const sessionOptions = { 
    store,
    secret : process.env.SECRET ,
    resave : false ,
    saveUninitialized : true,
    //cookie option when it expires and max age
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}

//middlewares
app.set("view engine" , "ejs"); //done
app.set("views" , path.join(__dirname , "views")) //done
app.use(express.urlencoded({ extended: true })); //done
app.use(methodOverride('_method'));  
app.engine("ejs" , ejsmate); //done
app.use(express.static(path.join(__dirname , "public")))








app.listen( port , () => {
    console.log("app is listening on port")
});

app.get("/" , (req,res) =>{
  res.send("this is a home page")
})

//session and flash
app.use(session(sessionOptions)) //sending s-id in form of cookie 
app.use(flash());


//passport
app.use(passport.initialize()); // middleware that initialize passport authentication
app.use(passport.session()); // A web app needs the ability to identify users as they browse from page to page. that why we use session
                             // the series of res and req , each associated with same user , known as session. 
passport.use( new LocalStrategy(User.authenticate())); // using local sign up process and authenticate useer model
passport.serializeUser(User.serializeUser());  //Determines what user data gets stored in the session
passport.deserializeUser(User.deserializeUser()); //Retrieves the full user object from the stored session data

//flash middleware
app.use((req,res,next) =>{
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next();
})
app.get("/demouser" , async(req,res) =>{
    const fakeUser = new User({
        email : "student123@gmail.com",
        username : "delta-student"
    })

    let registeredUser = await User.register(fakeUser , "helloworld");
    res.send(registeredUser);
});

//Routers 
app.use("/listings" , listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/" , userRouter);




// page not found error

app.use( (req ,res, next) =>{
    next(new ExpressError(404 , "Page not found"));
})

//error handler middleware
app.use((err, req,res,next) =>{
    let{statusCode = 500 , message= "Something went occured"} = err;
    res.status(statusCode).render("listings/error.ejs" , {message});
})



