var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var db = require('./models/index.js');
var app = express();

//var searchTerm = "mary"
// this is only on your banch
// app settings
app.set("view engine", "ejs");

//app use settings telling node to parse data from POST
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + '/public')); // this tells node to serve files from public folder(css)


// index routes

app.get("/", function(req, res){ 
  res.render('movies/index');
})

// about routes

app.get("/about", function(req, res){ 
  res.render('movies/about');
})


// search routes

app.get("/search", function(req, res){ 
  var movieTitle = req.query.title;
  request("http://www.omdbapi.com/?s=" + movieTitle, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var movies = JSON.parse(body);
      
      // console.log(movies["Search"]);
      // res.render("moviePage", stuff)
      res.render("movies/search", {movies: movies, searchTerm: movieTitle});
      }
    })
})



//  results routes
app.get("/movies/results/:id", function(req, res){
  var id = req.params.id
  var plot = req.params.plot
  request("http://www.omdbapi.com/?i=" + id + "&tomatoes=true&" + plot, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var movies = JSON.parse(body);
      movies.prevSearch = req.query.lastSearch;
      // console.log(movies["Search"]);
      // res.render("moviePage", stuff)
      res.render("movies/results", movies);
    }
    })
})  

// watch list routes//
app.post('/list', function (req, res) {
  // res.send("ok");
  var watchItem = {
    imdb_code : req.body.imdbCode,
    year : req.body.year,
    title : req.body.title
  };
  // console.log('imdbcode',imdbCode);
  db.movedb.findOrCreate({where: watchItem}).done(function (error, data, created) {
    if(error) throw error;
    // console.log(arguments);
    // console.log('created');\
    console.log(watchItem);
    res.send({data: data,created: created});
 
  })
});


app.get('/list', function(req, res) {
  var data = db.movedb.findAll({order: 'title ASC'}).done(function(error, data) {
    res.render('movies/list', {data: data});
  })
})

//watchlist delete routes//

app.delete("/list/:id", function(req, res){
  // res.send(req.body);
  db.movedb.find({where: {id: req.params.id}}).then(function(deleteList){
    deleteList.destroy().success(function(){
      // res.redirect("/list")
      res.send({deleted: "taco"});
    })
  })
});

// watchlist comment routes //

app.get("/list/:id/comments", function(req, res){
   var commentId = req.params.id
   db.content.findAll({where: {movedbId: commentId}}).then(function(commentList){
      
     res.render("movies/comments", {commentId: commentId, commentList: commentList});
  //     res.send("movies/comments");
    })

})


   
app.post("/list/:id/comments", function(req, res){
   var movedbId = req.params.id;
 
    db.movedb.find({where: {id: movedbId}}).then(function(newText){
    newText.createContent({movedbId: req.body.id, content: req.body.commentBox}).then(function(commentData){
      res.send({commentData: commentData});
    })
  })
  
})




app.listen(process.env.PORT || 3000);