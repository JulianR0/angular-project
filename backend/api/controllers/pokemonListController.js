'use strict';

var mongoose = require( 'mongoose' );
var BasePokemon = mongoose.model( 'BasePokemon' );

// Returns all pokemon from the internal list
exports.find_all_pokemon = function( req, res )
{
	BasePokemon.find( {}, function( err, task )
	{
		if ( err )
			res.send( err );
		res.json( task );
	});
};

// Returns a pokemon from the internal list
exports.find_pokemon = function( req, res )
{
	BasePokemon.find( { _id: req.params.pkmnID }, function( err, task )
	{
		if ( err )
			res.send( err );
		res.json( task );
	});
};

// Saves a new pokemon to the internal list
exports.add_pokemon = function(req, res)
{
	var new_user = new BasePokemon(req.body);
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
	BasePokemon.findOneAndUpdate( { _id: req.params.pkmnID }, req.body, {new: true}, function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

// Removes a pokemon from the internal list
exports.delete_pokemon = function(req, res)
{
	BasePokemon.remove( { _id: req.params.pkmnID }, function(err, task)
	{
		if (err)
			res.send(err);
		res.json( { message: 'Pokemon removed' } );
	});
};
