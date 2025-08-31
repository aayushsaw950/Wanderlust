const User = require("../models/user.js"); //done


module.exports.renderSignup = (req ,res) =>{
    res.render("users/signup.ejs");
}

module.exports.signUp =async(req, res , next)=>{
    try{
    const {username , email , password} = req.body;
    const newUser = new User({ username , email});
    const registeredUser = await User.register(newUser , password);
    req.login(registeredUser , (err) =>{
        if(err){
           return next(err);
        } else{
         req.flash("success" , "Welcome to wanderlust!");
        res.redirect("/listings");
        }
    })
   

    } catch(e){
        req.flash("error" , e.message);
        res.redirect("/login");
    }
  

}

module.exports.renderLogin = (req,res) =>{
    res.render("users/login.ejs");
}


module.exports.login = async(req , res , next) =>{
   req.flash("success" , "welcome back to wanderlust!");
   let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
}

module.exports.logOut = (req ,res , next) =>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "logged you out !");
        res.redirect("/listings");
    })
}