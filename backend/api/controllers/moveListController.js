'use strict';

var mongoose = require( 'mongoose' );
var Move = mongoose.model( 'Move' );

// Returns all moves from the internal list
exports.find_all_moves = function( req, res )
{
	Move.find( {}, function( err, task )
	{
		if ( err )
			res.send( err );
		res.json( task );
	});
};

// Returns all moves from the internal list that matches the search term
exports.find_move = function( req, res )
{
	// Apply regex to this so substrings can be used as search terms
	Move.find( { moveName: { '$regex': req.params.movName, '$options': 'i' } }, function( err, task )
	{
		if ( err )
			res.send( err );
		res.json( task );
	});
};

// Saves a new move to the internal list
exports.add_move = function(req, res)
{
	var new_user = new Move(req.body);
	new_user.save(function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

// Updates an existting move from the internal list with new data
exports.update_move = function(req, res)
{
	Move.findOneAndUpdate( { moveName: req.params.movName }, req.body, {new: true}, function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

// Removes a move from the internal list
exports.delete_move = function(req, res)
{
	Move.remove( { moveName: req.params.movName }, function(err, task)
	{
		if (err)
			res.send(err);
		res.json( { message: 'Move removed' } );
	});
};

// Calculates damage
exports.calc_damage = function(req, res)
{
	// TEMP: Since we don't have any stats yet, let's pretend the values are all 1.
	// THAT'S A LOTSA "1"s!
	// Remind me to change the 1's to actual variables >.>
	var level = 1;
	var power = 1;
	var random = Math.random() * (1.00 - 0.85) + 0.85; // random number between 0.85 - 1.00
	var modifier = 1 * 1 * 1 * random * 1 * 1 * 1 * 1
	var damage = Math.floor(((((2 * level / 5) + 2) * power * 1 / 1 / 50) + 2) * modifier);
	
	res.json( { damage: damage } );
};
