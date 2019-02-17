var middlewareObj ={}

middlewareObj.checkcampgroundOwnership = function checkOwnership(req,res,next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id,function(err,foundCampground){
      if(err){
        req.flash("error","Campground not found!");
        redirect("back");
      }
      else {
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }
        else {

            req.flash("error","You don't have permission to do that ");
          res.redirect("back");
        }
  }
});
}
  else {
    req.flash("error","You need to logged in to do that ");
    res.redirect("back");
  }

}

middlewareObj.checkcommentOwnership = function checkOwnership(req,res,next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id,function(err,foundComment){
      if(err){
          redirect("back");
      }
      else {
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }
        else {

          req.flash("error","You don't have permission to do that ");
          res.redirect("back");
        }
  }
});
}
  else {
  req.flash("error","You need to logged in to do that ");
    res.redirect("back");
  }

}
middlewareObj.isLoggedIn = function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error","You need to logged in to do that ");
  res.redirect("/login")
}



module.exports = middlewareObj
