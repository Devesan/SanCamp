//==============================================================================================//
//comments route

var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds"),
    Comment = require("../models/comments");

var middleware = require("../middlewares");
//new comment form

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
    if(err){
      console.log("error");
    }
    else{
      console.log(campground);
      res.render("comments/new", {campground : campground});
    }
  });
});

//new comment
router.post("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }
    else{
      Comment.create(req.body.comment,function(err,comment){
        if(err){
          console.log(err);
          req.flash("error","Something went wrong ");
          res.redirect("/campgrounds");
        }
        else {
          //add username and id to the comments
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          req.flash("success","Successfully added Comment ");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
});
});

router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkcommentOwnership,function(req,res){
  Comment.findById(req.params.comment_id,function(err,founComments){
    if(err){
      res.redirect("back");
    }
    else{
      res.render("comments/edit",{campground_id: req.params.id ,comment : founComments});
    }
  });

});

router.put("/campgrounds/:id/comments/:comment_id",middleware.checkcommentOwnership,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
    if(err){
      res.redirect("back")
    }
      else {
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkcommentOwnership,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err){
      res.redirect("back");
    }
    else {

      req.flash("success","Comment deleted");
        res.redirect("/campgrounds/"+req.params.id);
    }
  });
});



module.exports = router;
