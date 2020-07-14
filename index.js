const // Dependencies
  methodOverride = require("method-override"),
  localStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  passport = require("passport"),
  mongoose = require("mongoose"),
  express = require("express"),
  // Models
  campground = require("./models/campground"),
  comment = require("./models/comment"),
  seed_db = require("./models/seed"),
  user = require("./models/user"),
  // Routes
  campgroundRoutes = require("./routes/campgrounds"),
  commentRoutes = require("./routes/comments"),
  indexRoutes = require("./routes/index"),
  app = express(),
  port = 9000;

// Connect to yelpCamp database
mongoose.connect("mongodb://localhost/yelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.use(bodyParser.urlencoded({ extended: true }));
// __dirname is the directory that this script is currently running
app.use(express.static(`${__dirname}/public`));
app.use(flash());

// override with POST  
app.use(methodOverride("_method"));

// Allows you to omit the .ejs extension
app.set("view engine", "ejs");

// Passport configuration
app.use(
  require("express-session")({
    secret: "YelpCamp admin page",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  // Adds the scope of currentUser and message to all templates
  res.locals.currentUser = req.user,
  res.locals.flash_success = req.flash("success");
  res.locals.flash_error = req.flash("error");
  next();
});

// Seed the database with fixed content
// seed_db();

/** RESTful convention: A pattern of routes that other people can follow **/

/* name     url                     verb    description 
=====================================================================================
 * -Index   /campgrounds            GET     Displays all the campgrounds
 * -New     /new                    GET     The form to fill in for the new campground
 * -Create  /campground             POST    Adds a new campground based off the form
 * -Show    /campgrounds/:id        GET     Show information for a certain campground
 * -Edit    /campgrounds/:id/edit   GET     Shows the edit form for a campground
 * -Update  /campgrounds/:id        PUT     Update a campground then redirect
 * -Destroy /campgrounds/:id        DELETE  Delete a campground, then redirect
*/

// Add routes
/* Basically include the routes since they're in a different file
 * The first string argument allows the route in their respective file
 * to be shorten, so instead of router.get(/campgrounds/new) it can be
 * shorten to router.get(/new)
 */
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

app.listen(port, () => {
  console.log(`YelpCamp server started on port ${port}`);
});
