'use strict';
var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var MoveSchema = new Schema
({
	moveName:
	{
		type: String,
		required: 'Missing move name!'
	},
	moveDescription:
	{
		type: String,
		required: 'Missing move description!'
	},
	moveAccuracy:
	{
		type: Number,
		default: 100
	},
	movePower:
	{
		type: Number,
		default: 40
	},
	movePP:
	{
		type: Number,
		default: 35
	},
	moveCategory:
	{
		type: Number,
		default: 0
	},
	moveAttribute:
	{
		type: Number,
		default: 1
	}
});

module.exports = mongoose.model( 'Move', MoveSchema, '[INTERNAL]_Moves' );
