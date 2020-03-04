// init vars
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

// models
var BasePokemon = require('./api/models/pokemonListModel');
var Move = require('./api/models/moveListModel');
var Team = require('./api/models/teamModel');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect( 'mongodb://localhost/ProjectPDL', 
{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var routes = require('./api/routes/RESTRoutes'); //importing route
routes(app); //register the route

app.use(function(req, res /*, next */ )
{
	res.status(404).send({url: req.originalUrl + ' not found'});
	/*
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
	*/
});

app.listen(port);

console.log('RESTful API server started on PORT: ' + port);
