'use strict';

var mongoose = require( 'mongoose' );
var Team = mongoose.model( 'Team' );

// Gets all teams from the player
exports.get_all_teams = function(req, res)
{
	Team.find({/* all */}, function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

// Creates a new team
exports.save_team = function(req, res)
{
	var new_user = new Team(req.body);
	new_user.save(function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

// Gets one specific team
exports.get_team = function(req, res)
{
	Team.find( { _id: req.params.teamID }, function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

// Updates an existing team with new data
exports.update_team = function(req, res)
{
	Team.findOneAndUpdate( { _id: req.params.teamID }, req.body, {new: true}, function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

// Removes a team
exports.delete_team = function(req, res)
{
	Team.remove( { _id: req.params.teamID }, function(err, task)
	{
		if (err)
			res.send(err);
		res.json( { message: 'Team removed' } );
	});
};

// Sets the selected team as active
exports.set_active_team = function(req, res)
{
	Team.find({/*all*/}, function(err, task)
	{
		if (err)
		{
			res.send(err);
			return;
		}
		
		for(var i=0; i < task.length; i++)
		{
			if (task[i].isActive == true)
			{
				task[i].isActive = false;
				Team.findOneAndUpdate( { _id: task[i]._id }, task[i], {new: true}, function(err2, task2)
				{
					if (err)
					{
						res.send(err2);
						return;
					}
				});
				break;
			}
		}
	});
	
	Team.findOneAndUpdate( { _id: req.params.teamID }, req.body, {new: true}, function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

// Returns active team
exports.get_active_team = function(req, res)
{
	Team.findOne({ isActive: true }, function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

/*
exports.list_all_tasks = function(req, res)
{
	Task.find({}, function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

exports.create_a_task = function(req, res)
{
	var new_task = new Task(req.body);
	new_task.save(function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

exports.read_a_task = function(req, res)
{
	Task.findById(req.params.taskId, function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

exports.update_a_task = function(req, res)
{
	Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task)
	{
		if (err)
			res.send(err);
		res.json(task);
	});
};

exports.delete_a_task = function(req, res)
{
	Task.remove({_id: req.params.taskId}, function(err, task)
	{
		if (err)
			res.send(err);
		res.json({ message: 'Task successfully deleted' });
	});
};
*/