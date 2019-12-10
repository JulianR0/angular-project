'use strict';
var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var PokemonSchema = new Schema
({
	dexID:
	{
		type: Number,
		required: 'Missing Pokedex number!'
	},
	defaultName:
	{
		type: String,
		required: 'Missing Pokemon name!'
	},
	attributeType:
	{
		type: Array,
		default: [ "0", "0" ]
	}
});

module.exports = mongoose.model( 'Pokemon', PokemonSchema, '[INTERNAL]_Pokemon' );
