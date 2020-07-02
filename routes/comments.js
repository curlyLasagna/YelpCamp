const 
    campground = require("../models/campground"),
    comment = require("../models/comment"),
    express = require("express");

let 
    router  = express.Router({
        // This option merges the params from campground and the comments together
        // in order to access params.id from campgrounds
        mergeParams: true
    });

/* Before going completing the route, isLoggedIn function is called
 * If it returns true, it runs next(), which is the 
 * If it returns false, it will redirect somewhere else */
router.get("/new", isLoggedIn, (req, res)=> {
    campground.findById(req.params.id, function (err, campground){
        (err) ?
        console.log(err) :
        res.render("comments/new", {campground: campground});
    })
})

/* Someone can send a post request to comment, without even logging in 
 * so adding isLoggedIn as middleware
 * will prevent that from hrouterening */
router.post("/", isLoggedIn, (req, res)=>{
    campground.findById(req.params.id, (err, campground)=>{
        if (err) {
            console.log(err); 
            res.redirect("/campgrounds");
        }
        else {
            comment.create(req.body.comment, (err, comment)=>{
                if (err)
                    console.log(err) 
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    // saves the comment
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`)
                }
            })
        }
    })
})

// We can use this function to whatever functionality that
// requires a log in. This is a middleware
function isLoggedIn(req, res, next) {

    if(req.isAuthenticated())
        return next();

    res.redirect("/login")
}

module.exports = router;