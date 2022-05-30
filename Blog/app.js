//jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "This journal touches on all things coding.";
        
const aboutContent = " This journal is for my coding notes to help prepare me for a job in the tech industry.";


const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//conects to mongodb database
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

// use res.render to load up an ejs view file

//index page
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});
//compose page
app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});
//post page
app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});
//about page
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});



let port = process.env.PORT;
if (port == null || port == "") {
   port = 3000;
}





//connects to local server
app.listen(port, function() {
  console.log("Server started on port 3000");
});
