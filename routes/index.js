const express = require("express"),
  passport = require("passport"),
  user = require("../models/user");

let router = express.Router();

// Root route
router.get("/", (req, res) => {
  res.render("landing");
});

// Autherization routes
router.get("/register", (req, res) => {
  res.render("register");
});

// Sign up logic
router.post("/register", (req, res) => {
  // Provided by the passport-local-mongoose package
  let newUser = new user({ username: req.body.username });
  // Adds the user to our mongo database with
  user.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    // After the user signs up successfully, they will be redirected
    // to the campgrounds page
    passport.authenticate("local")(req, res, () => {
      req.flash("success", `Welcome to YelpCamp ${user.username}`);
      res.redirect("/campgrounds");
    });
  });
});

// Login form
router.get("/login", (req, res) => {
  // Send the flash with the key error (See middleware/index.js)
  res.render("login");
});

// Login logic
router.post(
  "/login",
  passport.authenticate(
    "local",
    // passport middleware
    {
      // Redirect to campgrounds if user is valid
      successRedirect: "/campgrounds",
      // Go back to login if user isn't valid
      failureRedirect: "/login",
    }
  ),
  (req, res) => {}
);

// Logging out
router.get("/logout", (req, res) => {
  // passport function that logs out user
  req.logOut();
  req.flash("success", "Logged you out");
  res.redirect("/campgrounds");
});

router.get("*", (req, res) => {
  res.send("This part of the website is non existent");
});

module.exports = router;
