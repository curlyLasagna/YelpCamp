const 
    mongoose = require("mongoose"),
    express = require("express"),
    bodyParser = require("body-parser"),
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

// Monog schema init
let 
    campgroundSchema = new mongoose.Schema({
        name: String,
        image: String,
        description: String
    }), 
    Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
    // name: "Reddington", 
    // image: "https://cdn.pixabay.com/photo/2017/07/17/16/16/nature-2512932_960_720.jpg"}, (err, campground)=>{
    // (err) ? 
    // console.log(err) :
    // console.log("New campground: " + campground.name);
// });
// Array from v1
// let campgrounds = [
    // {name: "Sabino Canyon", image: "https://cdn.pixabay.com/photo/2016/01/26/23/32/camp-1163419_960_720.jpg"},
    // {name: "Reddington", image: "https://cdn.pixabay.com/photo/2017/07/17/16/16/nature-2512932_960_720.jpg"},
    // {name: "Loch Raven", image: "https://cdn.pixabay.com/photo/2020/02/09/08/08/tent-4832253_960_720.jpg"},
    // {name: "Sandy Creek", image: "https://cdn.pixabay.com/photo/2015/08/04/11/02/caravans-874549_960_720.jpg"},
    // {name: "White Marsh", image: "https://cdn.pixabay.com/photo/2015/05/23/00/25/utah-780108_960_720.jpg"}
// ];

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
    Campground.find({}, (err, campgrounds_from_db)=>{
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
        newCampground = {
            name: name,
            image: image,
            description: description
        };
    
    // Push the new campground from user input into the campgrounds array
    // campgrounds.push(newCampground);
    // Create a new campground and save to database
    Campground.create(newCampground, (err, newCampgrounds_to_db) =>{
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
    Campground.findById(req.params.id, (err, foundCampground)=>{
        (err) ?
        console.log(err) :
        // Pass campground to the "show" route
        res.render("show", {campground: foundCampground});
    });
})

app.listen(3000, ()=>{
    console.log("YelpCamp server started");
})