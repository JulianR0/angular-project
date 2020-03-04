'use strict';

// Calculates damage
exports.calc_damage = function(req, res)
{
	var targets = 1; // We are sticking to single target moves for now
	var weather = 1; // No weather effects, yet
	var critical = 1; // No critical hits, yet
	var stab = 1; // STAB is planned, though
	var random = Math.random() * (1.00 - 0.85) + 0.85; // random number between 0.85 - 1.00
	var type = 1; // Weakness/Resistanse is also next
	var burn = 1; // No status ailments, yet
	var other = 1; // These are the pokemon abilities. Last in the list.
	
	var modifier = targets * weather * critical * random * stab * type * burn * other
	
	var ownerLevel = 1;
	var movePower = 1;
	
	var ownerAttack = 1;
	var targetDefense = 1;
	
	var damage = Math.floor(((((2 * ownerLevel / 5) + 2) * movePower * ownerAttack / targetDefense / 50) + 2) * modifier);
	
	res.json( { damage: damage } );
};
