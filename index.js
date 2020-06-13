const 
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("/public"));
app.set("view engine", "ejs");
app.get("/", (req, res)=>{
        res.render("landing");
})

let campgrounds = [
    {name: "Sabino Canyon", image: "https://cdn.pixabay.com/photo/2016/01/26/23/32/camp-1163419_960_720.jpg"},
    {name: "Reddington", image: "https://cdn.pixabay.com/photo/2017/07/17/16/16/nature-2512932_960_720.jpg"},
    {name: "Loch Raven", image: "https://cdn.pixabay.com/photo/2020/02/09/08/08/tent-4832253_960_720.jpg"},
    {name: "Sandy Creek", image: "https://cdn.pixabay.com/photo/2015/08/04/11/02/caravans-874549_960_720.jpg"},
    {name: "White Marsh", image: "https://cdn.pixabay.com/photo/2015/05/23/00/25/utah-780108_960_720.jpg"}
];

app.get("/campgrounds", (req, res)=>{
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.get("/new", (req, res) =>{
    res.render("new");
})

app.post("/campgrounds", (req, res)=>{
    // Get data from form and add to campgrounds array
    // Also redirects to the campgrounds page
    let 
        name = req.body.name,
        image = req.body.image,
        newCampground = {
            name: name,
            image: image
        };
    
    // Push the new campground from user input into the campgrounds array
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

// RESTful convention
app.get("/campgrounds/new", (req, res)=>{
    res.render("new.ejs");
});


app.listen(3000, ()=>{
    console.log("YelpCamp server started");
})