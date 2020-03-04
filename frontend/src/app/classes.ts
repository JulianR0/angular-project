export class BasePokemon
{
	dexID: number;
	defaultName: string;
	attributeType: number[] = [];
	baseStats: number[] = [];
	learnableMoves: string[];
	learnByLevel: number[];
	spriteURL: string;
}

export class PlayerPokemon // We will use these for the enemy pokemon as well.
{
	baseID: string;
	customName: string;
	currentHP: number;
	statEV: number[] = [];
	statIV: number[] = [];
	statNature?: number; // Don't implement yet but keep the member for future development.
	expPoints: number;
	moveIDList: string[] = [];
}

export class Move
{
	moveName: string;
	moveDescription: string;
	moveAccuracy: number;
	movePower: number;
	movePP: number;
	moveCategory: number;
	moveAttribute: number;
}

export class Team
{
	teamName: string;
	teamData: PlayerPokemon[] = [];
	isActive: boolean;
}
