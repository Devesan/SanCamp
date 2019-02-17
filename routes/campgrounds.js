var express = require("express");
var router = express.Router();
var passport = require("passport");
var middleware = require("../middlewares");

var Campground = require("../models/campgrounds");

var moment = require("moment");



router.get("/campgrounds", function(req, res) {

//  res.render("campgrounds", {  campgrounds: campgrounds});
Campground.find({},function(err,allcampground){
  if(err){
    console.log("error");
  }
  else {
    res.render("campgrounds/index", {campgrounds: allcampground});
  }
});
});

router.post("/campgrounds", middleware.isLoggedIn,function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id : req.user._id,
    username : req.user.username
  };
  var price = req.body.price;
  var newCampground = {
    name: name,
    image: image,
    description : desc,
    author :author,
    price : price
  };

  Campground.create(newCampground,function(err,newlycreated){
    if(err){
      console.log("error");
    }
    else{
        res.redirect("/campgrounds");
    }
  });
});

router.get("/campgrounds/new",middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

router.get("/campgrounds/:id",function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    if(err){
      console.log("error");
    }
    else{
      res.render("campgrounds/show",{campground : foundCampground,moment : moment});
    }
  });
});

router.get("/campgrounds/:id/edit",middleware.checkcampgroundOwnership,function(req,res){
//is loggedin

      Campground.findById(req.params.id,function(err,foundCampground){
            res.render("campgrounds/edit",{campground:foundCampground});
  });

});


router.put("/campgrounds/:id",middleware.checkcampgroundOwnership,function(req,res){
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
    if(err){
      res.redirect("/campgrounds")
    }
      else {
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

router.delete("/campgrounds/:id",middleware.checkcampgroundOwnership,function(req,res){
Campground.findByIdAndRemove(req.params.id,function(err,campgroundRemoved){
  if(err){
    res.redirect("/campgrounds");
  }
  else {
    Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } },(err) =>//shortcut for function
    {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
  });
}
});
})
//middleware


module.exports = router;
