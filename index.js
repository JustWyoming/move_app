var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var db = require('./models/index.js');
var app = express();

//var searchTerm = "mary"

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
      movies.searchResults = movieTitle;
      // console.log(movies["Search"]);
      // res.render("moviePage", stuff)
      res.render("movies/search", {movies: movies});
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
  // console.log("inside");
  // console.log(req.body.imdbCode);

  // res.send(req.body);
  // return;

  var watchItem = {
    imdb_code : req.body.imdbCode,
    year : req.body.year,
    title : req.body.title
  };
  // console.log('imdbcode',imdbCode);
  db.MoveDB.findOrCreate({where: watchItem}).done(function (error, data, created) {
    if(error) throw error;
    // console.log(arguments);
    // console.log('created');\
    console.log(watchItem);
    res.send({data: data,created: created});
    

    // if(created) {
      // console.log('here2');
            // res.send({data: data});
            //var data = db.MoveDB.findAll({order: 'title ASC'}).done(function(error, data) {
            //})          
    // } else {
      // console.log(db);
      // var data = db.MoveDB.findAll({order: 'title ASC'}).done(function(error, data) {
        // res.render("movies/list", {data: data});
        // res.send({data: data,created: created});
      // })
    // }
  })
});



app.get('/list', function(req, res) {
  var data = db.MoveDB.findAll({order: 'title ASC'}).done(function(error, data) {
    res.render('movies/list', {data: data});
  })
})

//delete routes//

app.delete("/list/:id", function(req, res){
  // res.send(req.body);
  db.MoveDB.find({where: {id: req.params.id}}).then(function(deleteList){
    deleteList.destroy().success(function(){
      // res.redirect("/list")
      res.send({deleted: "taco"});
    })
  })
});









app.listen(process.env.PORT || 3000);