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

// Returns a move from the internal list
exports.find_move = function( req, res )
{
	Move.find( { _id: req.params.moveID }, function( err, task )
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
	Move.findOneAndUpdate( { _id: req.params.moveID }, req.body, {new: true}, function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

// Removes a move from the internal list
exports.delete_move = function(req, res)
{
	Move.remove( { _id: req.params.moveID }, function(err, task)
	{
		if (err)
			res.send(err);
		res.json( { message: 'Move removed' } );
	});
};
