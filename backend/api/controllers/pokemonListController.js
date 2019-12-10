'use strict';

var mongoose = require( 'mongoose' );
var Pokemon = mongoose.model( 'Pokemon' );

// Returns all pokemon from the internal list
exports.find_all_pokemon = function( req, res )
{
	Pokemon.find( {}, function( err, task )
	{
		if ( err )
			res.send( err );
		res.json( task );
	});
};

// Returns all pokemon from the internal list that matches the search term
exports.find_pokemon = function( req, res )
{
	// Apply regex to this so substrings can be used as search terms
	Pokemon.find( { defaultName: { '$regex': req.params.pkmnName, '$options': 'i' } }, function( err, task )
	{
		if ( err )
			res.send( err );
		res.json( task );
	});
};

// Saves a new pokemon to the internal list
exports.add_pokemon = function(req, res)
{
	var new_user = new Pokemon(req.body);
	new_user.save(function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

// Updates an existting pokemon from the internal list with new data
exports.update_pokemon = function(req, res)
{
	Pokemon.findOneAndUpdate( { defaultName: req.params.pkmnName }, req.body, {new: true}, function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

// Removes a pokemon from the internal list
exports.delete_pokemon = function(req, res)
{
	Pokemon.remove( { defaultName: req.params.pkmnName }, function(err, task)
	{
		if (err)
			res.send(err);
		res.json( { message: 'Pokemon removed' } );
	});
};
