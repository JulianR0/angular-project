'use strict';
var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var TeamSchema = new Schema
({
	userName:
	{
		type: String,
		required: 'Missing user name!'
	},
	teamName:
	{
		type: String,
		required: 'Missing team name!'
	},
	teamData:
	{
		type: Array,
		default: undefined
	},
	isActive:
	{
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model( 'Team', TeamSchema, 'UserTeams' );
