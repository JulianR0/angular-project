import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'; 

import { ClassesService } from '../classes.service';
import { PopupsComponent } from '../popups/popups.component';
import { Pokemon } from '../classes';
import { Team } from '../classes';


@Component
({
	selector: 'app-pokemon',
	templateUrl: './pokemon.component.html',
	styleUrls: ['./pokemon.component.css']
})

export class PokemonComponent implements OnInit, OnDestroy
{
	szTeamName: string = '';
	playerTeam: Pokemon[] = [];
	ddPokemonList_Form: FormGroup;
	ddPokemonList_Orders: string[] = [];
	szMessage: string = '';
	szSaveStatus: string = '';
	szTitle: string = 'BLAH';
	teamID: string = '';
	
	destroy$: Subject< boolean > = new Subject< boolean >();
	
	constructor( private PKMNService: ClassesService, private matDialog: MatDialog, private formBuilder: FormBuilder, private route: ActivatedRoute, private location: Location ) { }
	
	ngOnInit()
	{
		// Get all available Pokemon
		this.ddPokemonList_Form = this.formBuilder.group( { ddPokemonList_Orders: [ '' ] } );
		this.PKMNService.GetPokemon( '' ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
		{
			for ( let iPokemon in data )
			{
				// Add to list
				this.ddPokemonList_Orders.push( data[ iPokemon ].defaultName );
			}
		});
		
		this.teamID = this.route.snapshot.paramMap.get('teamID');
		
		// Modifing an existting team?
		if ( this.teamID != 'new' )
		{
			this.szTitle = 'Modify Team';
			
			// Load team
			this.PKMNService.GetTeam( this.teamID ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
			{
				// Empty team?
				if ( data.length > 0 )
				{
					let fix = new Team();
					fix.teamData = data[ 0 ].teamData;
					this.szTeamName = data[ 0 ].teamName;
					
					for ( let iMembers in fix.teamData )
					{
						if ( fix.teamData[ iMembers ].dexID > 0 )
						{
							this.playerTeam.push( fix.teamData[ iMembers ] );
						}
					}
				}
			});
		}
		else
			this.szTitle = 'New Team';
	}
	
	addMember( pokemonName: string )
	{
		// Empty message log
		this.szMessage = '';
		this.szSaveStatus = '';
		
		// Only do stuff if box is NOT empty
		if ( pokemonName.length > 0 )
		{
			// Team is full, can't add
			if ( this.playerTeam.length >= 6 )
			{
				// Notify
				this.szMessage = `No more than 6 Pokemon can be added. Your team is full!`;
			}
			else
			{
				this.PKMNService.GetPokemon( pokemonName ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
				{
					// Checks
					if ( data.length == 0 )
					{
						// Not found
						this.szMessage = `No Pokemon matching "${pokemonName}" was found.`;
					}
					else if ( data.length > 1 )
					{
						// Multiple matches
						this.szMessage = `There are multiple Pokemon that matches "${pokemonName}". Refine your search term.`;
					}
					else
					{
						// This Pokemon should not be already on the player's team
						for ( let iMembers in this.playerTeam )
						{
							if ( this.playerTeam[ iMembers ].dexID == data[ 0 ].dexID )
							{
								// Notify and stop
								return ( this.szMessage = 'That Pokemon is already on your team!' );
							}
						}
						
						// We are good, add it
						data[ 0 ].customName = ''; // Define an empty name
						this.playerTeam.push( data[ 0 ] );
					}
				})
			}
		}
	}
	
	renameMember( pokemonMember: number )
	{
		// Initialize rename dialog box
		const dialogConfig = new MatDialogConfig();
		dialogConfig.data =
		{
			Pokemon: this.playerTeam[ pokemonMember ],
			doFunction: 'RENAME',
			iTeamMembers: this.playerTeam.length
		};
		
		// Popup the rename box
		let dialogRef = this.matDialog.open( PopupsComponent, dialogConfig );
		
		// Wait for dialog to complete then process
		dialogRef.afterClosed().subscribe( newName =>
		{
			// Only if we actually submitted a name
			if ( newName != undefined )
			{
				this.playerTeam[ pokemonMember ].customName = newName;
			}
		});
	}
	
	moveMember( pokemonMember: number )
	{
		// Initialize move dialog box
		const dialogConfig = new MatDialogConfig();
		dialogConfig.data =
		{
			Pokemon: this.playerTeam[ pokemonMember ],
			doFunction: 'MOVE',
			iTeamMembers: this.playerTeam.length
		};
		
		// Popup the move box
		let dialogRef = this.matDialog.open( PopupsComponent, dialogConfig );
		
		// Wait for dialog to complete then process
		dialogRef.afterClosed().subscribe( swapWith =>
		{
			// Only if we actually submitted a change
			if ( swapWith != undefined )
			{
				let preSwap = this.playerTeam[ pokemonMember ];
				let newSwap = Math.min( Math.max( swapWith, 1 ), this.playerTeam.length ) - 1; // Clamp to max.
				
				this.playerTeam[ pokemonMember ] = this.playerTeam[ newSwap ];
				this.playerTeam[ newSwap ] = preSwap;
			}
		});
	}
	
	deleteMember( pokemonMember: number )
	{
		// Initialize delete dialog box
		const dialogConfig = new MatDialogConfig();
		dialogConfig.data =
		{
			Pokemon: this.playerTeam[ pokemonMember ],
			doFunction: 'DELETE',
			iTeamMembers: this.playerTeam.length
		};
		
		// Popup the delete box
		let dialogRef = this.matDialog.open( PopupsComponent, dialogConfig );
		
		// Wait for dialog to complete then process
		dialogRef.afterClosed().subscribe( shouldDelete =>
		{
			// Only if we actually confirmed our delete
			if ( shouldDelete != undefined )
			{
				this.playerTeam.splice( pokemonMember, 1 );
			}
		});
	}
	
	renameTeam()
	{
		// Initialize team renamer dialog box
		const dialogConfig = new MatDialogConfig();
		dialogConfig.data =
		{
			doFunction: 'RENAME TEAM',
			szCurrentName: this.szTeamName
		};
		
		// Popup the team renamer box
		let dialogRef = this.matDialog.open( PopupsComponent, dialogConfig );
		
		// Wait for dialog to complete then process
		dialogRef.afterClosed().subscribe( newName =>
		{
			// Only if we actually submitted a name
			if ( newName != undefined )
			{
				this.szTeamName = newName;
			}
		});
	}
	
	setActive()
	{
		// Clear
		this.szMessage = '';
		this.szSaveStatus = '';
		
		// Can't set a team as active if it wasn't registered before
		if ( this.teamID == 'new' )
		{
			this.szSaveStatus = `Can't set an unregistered team as active. Save your team.`;
		}
		else
		{
			// Send to service
			this.PKMNService.SetActiveTeam( this.teamID ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
			{
				if ( data == null ) // null or undefined
				{
					this.szSaveStatus = `Mew got herself stuck. (An error ocurred.)`;
				}
				else
				{
					this.szSaveStatus = `"${this.szTeamName}" is now the active team.`;
				}
			});
		}
	}
	
	saveTeam()
	{
		// Clear
		this.szMessage = '';
		this.szSaveStatus = '';
		
		// Our team must be composed of at least one pokemon
		if ( this.playerTeam.length < 1 )
		{
			this.szSaveStatus = `Teams must be composed of at least one Pokemon!`;
		}
		// Team must have an indentificatory name
		else if ( this.szTeamName.length < 1 )
		{
			this.szSaveStatus = `Give your Team a name!`;
		}
		else
		{
			// Send to service
			this.PKMNService.SaveTeam( this.playerTeam, this.szTeamName, this.teamID ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
			{
				if ( data == null ) // null or undefined
				{
					this.szSaveStatus = `Mew got herself stuck. (An error ocurred.)`;
				}
				else
				{
					this.szSaveStatus = `Your team was saved.`;
					this.teamID = data[ '_id' ];
				}
			});
		}
	}
	
	ngOnDestroy()
	{
		this.destroy$.next( true );
		this.destroy$.unsubscribe();
	}
}
