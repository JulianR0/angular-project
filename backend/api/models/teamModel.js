'use strict';
var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var TeamSchema = new Schema
({
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
	},
	arrayPosition:
	{
		type: Number,
		required: 'Undefined array index!'
	}
});

module.exports = mongoose.model( 'Team', TeamSchema, 'UserTeams' );
