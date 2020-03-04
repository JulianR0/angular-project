'use strict';
var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var BasePokemonSchema = new Schema
({
	dexID:
	{
		type: Number,
		default: 0
	},
	defaultName:
	{
		type: String,
		default: 'MissingNo.'
	},
	attributeType:
	{
		type: Array,
		default: [ "0", "0" ] // [Primary Type] [Secondary Type]
	},
	baseStats:
	{
		type: Array,
		default: [ "0", "0", "0", "0", "0", "0" ] // [HP] [ATK] [DEF] [SpATK] [SpDEF] [Speed]
	},
	learnableMoves:
	{
		type: Array,
		default: undefined
	},
	learnByLevel:
	{
		type: Array,
		default: undefined // Ensure the array indexes matches the move list.
	},
	spriteURL:
	{
		type: String,
		default: 'assets/_img/pkmn/000.png'
	}
});

module.exports = mongoose.model( 'BasePokemon', BasePokemonSchema, '[INTERNAL]_Pokemon' );
