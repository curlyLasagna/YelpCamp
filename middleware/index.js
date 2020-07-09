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
        res.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          // author.id returns a mongoose object so we have to use the
          // built in method of .equals to compare the request
          res.redirect("back");
        }
      }
    });
  }
  // Returns the user back to the previous page
  else res.redirect("back");
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
        getComment.author.id.equals(req.user._id)
          ? next()
          : res.redirect("back");
      }
    });
  }
  // Returns the user back to the previous page
  else res.redirect("back");
};

// We can use this function to whatever functionality that
// requires a log in. This is a middleware.
middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
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
