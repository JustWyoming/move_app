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
  var title = req.query.title;
  request("http://www.omdbapi.com/?s=" + title, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var movies = JSON.parse(body);
      //console.log(movies["Search"]);
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
      //console.log(movies["Search"]);
      // res.render("moviePage", stuff)
      res.render("movies/results", movies);
    }
   
    
  })  
})

// watch list routes//
app.post('/list', function (req, res) {
  console.log(req.body.imdbCode);
  imdbCode = req.body.imdbCode;
  db.movedb.findOrCreate({where: {imdb_code: imdbCode}}).done(function (error, data, created) {
    console.log('created');
    if(created) {
      console.log('here2');
      request('http://www.omdbapi.com/?i='+imdbCode, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var movieData = JSON.parse(body);
          data.title = movieData.Title;
          data.year = movieData.Year;
          data.save().done(function (error, data) {
            var data = db.movedb.findAll().done(function(error, data) {
            res.render('movies/list', {data: data});
            })          
          })
        }
      })
    } else {
      console.log(db);
      var data = db.movedb.findAll().done(function(error, data) {
        res.render("movies/list", {data: data});
      })

    }
  })
})




app.get('/list', function(req, res) {
  var data = db.movedb.findAll().done(function(error, data) {
    res.render('movies/list', {data: data});
  })
})





app.listen(3000);