var express = require("express");
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    Campground = require("./models/campgrounds"),
    Comment = require("./models/comments"),
    User = require("./models/users"),
    seedDB = require("./seeds"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

var commentsRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/auth");

 //  seedDB(); Seed the database
//another way for db
// var url = process.env.DATABASEURL || "mongodb://localhost/Yelpcamp";
// mongoose.connect(url);

mongoose.connect("mongodb://localhost/Sancamp", { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
//Schema


// Campground.create(
//   {
//     name: "auroville",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTzNGJvZSAjiTEigZGgujb0-QEBaE-ukF-qCy-7-VYR3-z5ikC",
//     description:" The best place and society to live in the world"
// },function(err,campground){
//     if(err){
//       console.log("Error");
//     }
//     else{
//       console.log("Created");
//       console.log(campground);
//     }
//   });

//passport congigurastion

app.use(require("express-session")({
  secret : "Samantha is my darling",
  resave:false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");

  next();
});

app.use(authRoutes);
app.use(commentsRoutes);
app.use(campgroundRoutes);




app.listen(3000, function() {
  console.log("Sancamp  has started");
});
