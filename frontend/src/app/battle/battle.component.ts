import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ClassesService } from '../classes.service';
import { Pokemon, Move, Team } from '../classes';

@Component
({
	selector: 'app-battle',
	templateUrl: './battle.component.html',
	styleUrls: ['./battle.component.css']
})

export class BattleComponent implements OnInit, OnDestroy
{
	szPlayerTeam: string = 'Please wait...';
	szVSText: string = ''; // These should be initially empty
	szEnemyTeam: string = '';
	szActionText: string = '';
	arrBattleLogs: string[] = [ '', '', '', '', '', '', '', '', '' ];
	arrBattleLine: number = 0;
	
	playerTeam = new Team();
	enemyTeam = new Team();
	
	SINGLE_iActivePlayerMember: number = -1;
	SINGLE_iActiveEnemyMember: number = -1;
	
	iTurnNumber: number = 1;
	bCanAct: boolean = false;
	
	// Empty buttons
	szButton: string[] =
	[
		'_               ', // 16 char whitespace
		'_               ',
		'_               ',
		'_               ',
		'_               ',
		'_               ',
		'_               '
	];
	
	destroy$: Subject< boolean > = new Subject< boolean >();
	
	constructor( private PKMNService: ClassesService ) { }
	
	ngOnInit()
	{
		// Get current team
		this.PKMNService.GetActiveTeam().pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
		{
			this.playerTeam = data;
			if ( this.playerTeam == null )
			{
				// No active team
				this.szPlayerTeam = `You don't have any active team to send to battle.`;
			}
			else
			{
				// Initialize title vars
				this.szPlayerTeam = this.playerTeam.teamName;
				this.szVSText = `VS`;
				this.szEnemyTeam = `Enemy`;
				
				// Prepare player vars
				for ( let pokemon in this.playerTeam.teamData )
				{
					this.playerTeam.teamData[ pokemon ].health = 5;
				}
				this.SINGLE_iActivePlayerMember = 0;
				
				// Generate a random team of 3 Pokemon
				this.PKMNService.GetPokemon( '' ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
				{
					// Select a random one from the team
					while ( this.enemyTeam.teamData.length < 3 )
					{
						let iEntries = data.length;
						let iRNG = ( Math.floor(Math.random() * iEntries) + 1 ) - 1; // HEY-O LET'S BE LAZY AAAYYYYY
						this.enemyTeam.teamData.push( data[ iRNG ] );
						data.splice( iRNG, 1 ); // Prevent the same pokemon from being choosen
					}
					
					// Team has been formed, initialize values
					for ( let pokemon in this.enemyTeam.teamData )
					{
						this.enemyTeam.teamData[ pokemon ].health = 3;
					}
					this.SINGLE_iActiveEnemyMember = 0;
				});
			}
			
			// We are ready, battle init.
			this.LogBattle( `Turn ${this.iTurnNumber}` );
			
			// First pokemon slot
			if ( this.playerTeam.teamData[ 0 ].customName.length )
				this.szActionText = `What will ${this.playerTeam.teamData[ 0 ].customName} do?`;
			else
				this.szActionText = `What will ${this.playerTeam.teamData[ 0 ].defaultName} do?`;
			
			// TEMP: UPDATE ME
			this.szButton[ 0 ] = 'Test Move';
			
			// Allow acting
			this.bCanAct = true;
		});
	}
	
	useSingleMove( moveSlot: number )
	{
		// Buttons should not do anything if it's not our turn
		if ( this.bCanAct )
		{
			// Wait for next turn
			this.bCanAct = false;
			this.szActionText = 'Please wait...';
			
			// Prepare data
			let playerPokemon = this.playerTeam.teamData[ this.SINGLE_iActivePlayerMember ];
			let enemyPokemon = this.enemyTeam.teamData[ this.SINGLE_iActiveEnemyMember ];
			
			// Init text
			let name;
			if ( playerPokemon.customName.length )
				name = playerPokemon.customName;
			else
				name = playerPokemon.defaultName;
			this.LogBattle( `${name} used Test Move!` );
			
			// Send move and target to service, and let it be handled from there
			this.PKMNService.DoMove( playerPokemon, enemyPokemon ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
			{
				// We just process the data
				enemyPokemon.health -= data.damage;
				this.LogBattle( `${enemyPokemon.defaultName} took ${data.damage} damage!` );
				
				if ( enemyPokemon.health <= 0 )
				{
					// Opposing Pokemon fainted
					this.LogBattle( `${enemyPokemon.defaultName} fained!` );
					
					// Everyone is defeated?
					if ( ( this.SINGLE_iActiveEnemyMember + 1 ) == this.enemyTeam.teamData.length )
					{
						// We are done
						this.LogBattle( `${this.playerTeam.teamName} won the battle!` );
						this.szActionText = 'Battle end.';
					}
					else
					{
						// Send next Pokemon
						this.SINGLE_iActiveEnemyMember++;
						this.LogBattle( `The enemy team sends ${this.enemyTeam.teamData[this.SINGLE_iActiveEnemyMember].defaultName}!` );
						
						// Prepare next turn
						this.NextTurn();
					}
				}
				else
				{
					// It's the enemy's turn, now.
					this.SingleEnemyTurn();
				}
			});
		}
	}
	
	NextTurn()
	{
		// Increase turn counter
		this.iTurnNumber++;
		this.LogBattle( `Turn ${this.iTurnNumber}` );
		
		// Get active pokemon's name
		let playerPokemon = this.playerTeam.teamData[ this.SINGLE_iActivePlayerMember ];
		if ( playerPokemon.customName.length )
			this.szActionText = `What will ${playerPokemon.customName} do?`;
		else
			this.szActionText = `What will ${playerPokemon.defaultName} do?`;
		
		// Allow acting
		this.bCanAct = true;
	}
	
	SingleEnemyTurn()
	{
		// ToDo: No AI yet, so just pick and use a random move from it's moveset
		
		// This is just a copypaste but with logic applied from enemy to player instead
		let playerPokemon = this.playerTeam.teamData[ this.SINGLE_iActivePlayerMember ];
		let enemyPokemon = this.enemyTeam.teamData[ this.SINGLE_iActiveEnemyMember ];
		
		this.LogBattle( `${enemyPokemon.defaultName} used Test Move!` );
		
		this.PKMNService.DoMove( enemyPokemon, playerPokemon ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
		{
			let playerPokemonName;
			if ( playerPokemon.customName.length )
				playerPokemonName = playerPokemon.customName;
			else
				playerPokemonName = playerPokemon.defaultName;
			
			
			playerPokemon.health -= data.damage;
			this.LogBattle( `${playerPokemonName} took ${data.damage} damage!` );
			
			if ( playerPokemon.health <= 0 )
			{
				// Player Pokemon fainted
				this.LogBattle( `${playerPokemonName} fained!` );
				
				// Everyone is defeated?
				if ( ( this.SINGLE_iActivePlayerMember + 1 ) == this.playerTeam.teamData.length )
				{
					// GAME OVER YEEAAAAHHHHHHH
					this.LogBattle( 'You lost the battle...' );
					this.szActionText = 'Battle end.';
				}
				else
				{
					// No "switch" logic yet, so automatically send the next available slot
					this.SINGLE_iActivePlayerMember++;
					
					let newPokemonName;
					if ( this.playerTeam.teamData[this.SINGLE_iActiveEnemyMember].customName.length )
						newPokemonName = this.playerTeam.teamData[this.SINGLE_iActiveEnemyMember].customName;
					else
						newPokemonName = this.playerTeam.teamData[this.SINGLE_iActiveEnemyMember].defaultName;
					
					this.LogBattle( `Go ${newPokemonName}!` );
				}
			}
			
			// Prepare next turn
			this.NextTurn();
		});
	}
	
	dummy()
	{
		// Buttons should not do anything if it's not our turn
		if ( this.bCanAct )
		{
			
		}
	}
	
	LogBattle( message: string )
	{
		if ( this.arrBattleLine == 8 )
		{
			this.arrBattleLogs.splice(0, 1);
			this.arrBattleLogs.push( message );
		}
		else
		{
			this.arrBattleLogs[ this.arrBattleLine ] = message;
			this.arrBattleLine++;
		}
	}
	
	ngOnDestroy()
	{
		this.destroy$.next( true );
		this.destroy$.unsubscribe();
	}
}
