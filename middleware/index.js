// Where middleware definitions and declarations are stored. Same thing
let middlewareObj = {},
  campground = require("../models/campground"),
  comment = require("../models/comment");

middlewareObj.campgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    // Find the campground and if the user has the right permission,
    // proceed with the request, such as editing and deleting
    campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        req.flash("error", "Campground doesn't exist");
        res.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          // author.id returns a mongoose object so we have to use the
          // built in method of .equals to compare the request
          req.flash("error", "You need to be logged in to do that");
          res.redirect("back");
        }
      }
    });
  }
  // Returns the user back to the previous page
  else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.commentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    // Find the campground and if the user has the right permission,
    // proceed with the request, such as editing and deleting
    comment.findById(req.params.comment_id, (err, getComment) => {
      if (err) res.redirect("back");
      else {
        // author.id returns a mongoose object so we have to use the
        // built in method of .equals to compare the request
        if (getComment.author.id.equals(req.user._id)) next();
        else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  }
  // Returns the user back to the previous page
  else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

// We can use this function to whatever functionality that
// requires a log in. This is a middleware.
middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  // This won't actually display flash. This works like a dictionary, error being the key.
  // If you want to call the flash message, call it by req.flash("error")
  // Always set the flash dictionary before the redirect
  req.flash("error", "You need to be logged in first");
  res.redirect("/login");
};

module.exports = middlewareObj;

// Different ways of returning the middleware object
// let middlewareObj = {
// campgroudOwnership: () => {
// function definition
// }
// commentOwnership: () => {
// function definition
// module.exports = {
//     campgroundOwnership
//     commentOwnership
// }
// };
