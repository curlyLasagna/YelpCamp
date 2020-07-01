const 
    campground = require("../models/campground"),
    express = require("express"),
    router  = express.Router();

// Index route - show all campgrounds
router.get("/", (req, res)=>{
    // Instead of rendering the campgrounds array,
    // render the campgrounds from the database
    // res.render("campgrounds", {campgrounds:campgrounds});

    // Get campgrounds from database
    campground.find({}, (err, campgrounds_from_db)=>{
        (err) ?
        console.log(err) :
        res.render("campgrounds/index", {
            campgrounds:campgrounds_from_db 
            /* req.user contains information about the user
            * If no user is currently logged in, it will be undefined
            * If a user is logged in, it will have the username in the database
            * and it's respective id */ 
        });
    });
});

// Create route - adds a new campground
router.get("/new", (req, res) =>{
    res.render("campgrounds/new");
})

// New route - shows the form to create a new campground
router.post("/", (req, res)=>{
    // Get data from form and add to campgrounds array
    // Also redirects to the campgrounds page after the campground is created
    let 
        name = req.body.name,
        image = req.body.image,
        description = req.body.description,
        newcampground = {
            name: name,
            image: image,
            description: description
        };
    
    // Push the new campground from user input into the campgrounds array
    // campgrounds.push(newcampground);
    // Create a new campground and save to database
    campground.create(newcampground, (err, newcampgrounds_to_db) =>{
        (err) ?
        console.log(err) : 
        res.redirect("/campgrounds");
    })
});

// The order of the routes matter 
// If campgrounds/:id is declared first, then 
// campgrounds /new will never be reached
router.get("/new", isLoggedIn, (req, res)=>{
    res.render("campgrounds/new");
});


// Show - Shows more info about the campground
router.get("/:id", (req, res)=>{
    // Find the campground with provided ID
    // Render show template with that specific campground
    // res.send("This will be the show page")
    campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground) {
        (err) ?
        console.log(err) :
        // Pass campground to the "show" route
        res.render("campgrounds/show", {campground: foundcampground});
    });
})

// We can use this function to whatever functionality that
// requires a log in
function isLoggedIn(req, res, next) {

    if(req.isAuthenticated())
        return next();

    res.redirect("/login")
}

module.exports = router;