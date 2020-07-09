const campground = require("../models/campground"),
  middleware = require("../middleware"),
  comment = require("../models/comment"),
  express = require("express");

let router = express.Router({
  // This option merges the params from campground and the comments together
  // in order to access params.id from campgrounds model
  mergeParams: true,
});

/* Before going completing the route, isLoggedIn function is called
 * If it returns true, it runs next(), which is the
 * If it returns false, it will redirect somewhere else */
router.get("/new", middleware.isLoggedIn, (req, res) => {
  campground.findById(req.params.id, function (err, campground) {
    err
      ? console.log(err)
      : res.render("comments/new", { campground: campground });
  });
});

/* Someone can send a post request to comment, without even logging in
 * so adding isLoggedIn as middleware
 * will prevent that from happening */
router.post("/", middleware.isLoggedIn, (req, res) => {
  campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      comment.create(req.body.comment, (err, comment) => {
        if (err) console.log(err);
        else {
          // Sets the variables to pass to database
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          // saves the comment
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// Comment edit route
router.get("/:comment_id/edit", middleware.commentOwnership, (req, res) => {
  comment.findById(req.params.comment_id, (err, getComment) => {
    err
      ? res.redirect("back")
      : res.render("comments/edit", {
          campground_id: req.params.id,
          comment: getComment,
        });
  });
});

//Comment update route
router.put("/:comment_id", middleware.commentOwnership, (req, res) => {
  comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      err
        ? res.redirect("back")
        : res.redirect(`/campgrounds/${req.params.id}`);
    }
  );
});

// Comment destroy route
router.delete("/:comment_id", middleware.commentOwnership, (req, res) => {
  comment.findByIdAndRemove(req.params.comment_id, (err) => {
    err ? res.redirect("back") : res.redirect(`/campgrounds/${req.params.id}`);
  });
});

module.exports = router;
