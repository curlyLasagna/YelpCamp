const 
    mongoose = require("mongoose"),
    express = require("express"),
    bodyParser = require("body-parser"),
    campground = require("./models/campground"),
    seed_db = require("./models/seed"),
    app = express();

// Connect to yelpCamp database
mongoose.connect("mongodb://localhost/yelpCamp", {useNewUrlParser: true});
mongoose.set('useUnifiedTopology', true);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("/public"));
app.set("view engine", "ejs");

app.get("/", (req, res)=>{
        res.render("landing");
})

// Seed the database with fixed content
seed_db();

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
// Index route - show all campgrounds
app.get("/campgrounds", (req, res)=>{
    // Instead of rendering the campgrounds array,
    // render the campgrounds from the database
    // res.render("campgrounds", {campgrounds:campgrounds});

    // Get campgrounds from database
    campground.find({}, (err, campgrounds_from_db)=>{
        (err) ?
        console.log(err) :
        res.render("index", {campgrounds:campgrounds_from_db});
    })
});

// Create route - adds a new campground
app.get("/new", (req, res) =>{
    res.render("new");
})

// New route - shows the form to create a new campground
app.post("/campgrounds", (req, res)=>{
    // Get data from form and add to campgrounds array
    // Also redirects to the campgrounds page
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
// campgrounds/new will never be reached
app.get("/campgrounds/new", (req, res)=>{
    res.render("new");
});

// Show - Shows more info about the campground
app.get("/campgrounds/:id", (req, res)=>{
    // Find the campground with provided ID
    // Render show template with that specific campground
    // res.send("This will be the show page")
    campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground) {
        (err) ?
        console.log(err) :
        // Pass campground to the "show" route
        res.render("show", {campground: foundcampground});
    });
})

app.listen(9090, ()=>{
    console.log("YelpCamp server started");
})