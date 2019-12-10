export class Pokemon
{
	dexID: number;
	defaultName: string;
	customName: string;
	attributeType: number[] = [0, 0];
	health?: number;
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
	userName: string;
	teamName: string;
	teamData: Pokemon[] = [];
	isActive: boolean;
}
