'use strict';

module.exports = function(app)
{
	var pokemonList = require( '../controllers/pokemonListController' );
	var moveList = require( '../controllers/moveListController' );
	var team = require( '../controllers/teamController' );
	
	// pokemonList Routes
	app.route( '/rest/pokemonList' )
		.get( pokemonList.find_all_pokemon )
		.post( pokemonList.add_pokemon );
	
	app.route( '/rest/pokemonList/:pkmnName' )
		.get( pokemonList.find_pokemon )
		.put( pokemonList.update_pokemon )
		.delete( pokemonList.delete_pokemon );
	
	// moveList Routes
	app.route( '/rest/moveList' )
		.get( moveList.find_all_moves )
		.post( moveList.add_move );
	
	app.route( '/rest/moveList/:movName' )
		.get( moveList.find_move )
		.put( moveList.update_move )
		.delete( moveList.delete_move );
	
	// team Routes
	app.route( '/rest/team' )
		.post( team.save_team );
	
	app.route( '/rest/team/setactive/:accUserName/:teamID' )
		.put( team.set_active_team );
	
	app.route( '/rest/team/getactive/:accUserName' )
		.get( team.get_active_team );
	
	app.route( '/rest/team/findall/:accUserName' )
		.get( team.get_all_teams );
	
	app.route( '/rest/team/findone/:teamID' )
		.get( team.get_team )
		.put( team.update_team )
		.delete( team.delete_team );
	
	// moveDo Routes
	app.route( '/rest/moveDo' )
		.post( moveList.calc_damage );
	
	/*
	app.route('/tasks')
		.get(todoList.list_all_tasks)
		.post(todoList.create_a_task);
	
	app.route('/tasks/:taskId')
		.get(todoList.read_a_task)
		.put(todoList.update_a_task)
		.delete(todoList.delete_a_task);
	*/
};