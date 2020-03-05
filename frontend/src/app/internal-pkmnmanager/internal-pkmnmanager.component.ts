import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ClassesService } from '../classes.service';
import { PopupsComponent } from '../popups/popups.component';
import { BasePokemon } from '../classes';

@Component
({
	selector: 'app-internal-pkmnmanager',
	templateUrl: './internal-pkmnmanager.component.html',
	styleUrls: ['./internal-pkmnmanager.component.css']
})

export class InternalPKMNManagerComponent implements OnInit
{
	totalPokemon: BasePokemon[] = [];
	
	destroy$: Subject< boolean > = new Subject< boolean >();
	
	constructor( private PKMNService: ClassesService, private matDialog: MatDialog ) { }
	
	ngOnInit()
	{
		// Get all currently existing Pokemon
		this.PKMNService.GetPokemon().pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
		{
			for ( let iPokemon in data )
			{
				// Add to list
				this.totalPokemon.push( data[ iPokemon ] );
				
				// Remove TypeScript error by implicitly adding mongo "id" member
				this.totalPokemon[ '_id' ] = data[ iPokemon ][ '_id' ];
			}
			
			// Sort
			this.SortArray();
		});
	}
	
	getType( pokemon: BasePokemon )
	{
		let szReturn = '';
		
		if ( pokemon.attributeType == null )
			szReturn = 'Undefined';
		else
		{
			szReturn = this.PKMNService.arrTypeNames[ pokemon.attributeType[ 0 ] ];
			if ( pokemon.attributeType[ 1 ] > 0 )
			{
				szReturn += ' / ';
				szReturn += this.PKMNService.arrTypeNames[ pokemon.attributeType[ 1 ] ];
			}
		}
		
		return szReturn;
	}
	
	addPokemon()
	{
		// Initialize dialog box
		const dialogConfig = new MatDialogConfig();
		dialogConfig.data =
		{
			doFunction: 'ADD INTERNAL POKEMON',
			arrTypes: this.PKMNService.arrTypeNames
		};
		
		// Popup the rename box
		let dialogRef = this.matDialog.open( PopupsComponent, dialogConfig );
		
		// Wait for dialog to complete then process
		dialogRef.afterClosed().subscribe( newData =>
		{
			// Only if we actually submitted
			if ( newData != undefined )
			{
				this.PKMNService.SavePokemon( newData, 'new', 'MissingNo.' ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
				{
					// Remember to add the generated ID!
					newData[ '_id' ] = data[ '_id' ];
					
					// Update the entries
					this.totalPokemon.push( newData );
					
					// Re-Sort
					this.SortArray();
				});
			}
		});
	}
	
	editPokemon( pokemon: BasePokemon, indexNumber: number )
	{
		// Initialize dialog box
		const dialogConfig = new MatDialogConfig();
		dialogConfig.data =
		{
			Pokemon: pokemon,
			doFunction: 'EDIT INTERNAL POKEMON',
			arrTypes: this.PKMNService.arrTypeNames
		};
		
		// Popup the rename box
		let dialogRef = this.matDialog.open( PopupsComponent, dialogConfig );
		
		// Wait for dialog to complete then process
		dialogRef.afterClosed().subscribe( newData =>
		{
			// Only if we actually submitted
			if ( newData != undefined )
			{
				this.PKMNService.SavePokemon( newData, 'update', this.totalPokemon[ indexNumber ][ '_id' ] ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
				{
					// Update the entries
					pokemon.dexID = newData.dexID;
					pokemon.defaultName = newData.defaultName;
					pokemon.attributeType = newData.attributeType;
					pokemon.baseStats = newData.baseStats;
					pokemon.learnableMoves = newData.learnableMoves;
					pokemon.learnByLevel = newData.learnByLevel;
					pokemon.spriteURL = newData.spriteURL;
				});
				
				// Re-Sort
				this.SortArray();
			}
		});
	}
	
	deletePokemon( indexNumber: number )
	{
		// Initialize dialog box
		const dialogConfig = new MatDialogConfig();
		dialogConfig.data =
		{
			Pokemon: this.totalPokemon[ indexNumber ],
			doFunction: 'DELETE INTERNAL POKEMON'
		};
		
		// Popup the rename box
		let dialogRef = this.matDialog.open( PopupsComponent, dialogConfig );
		
		// Wait for dialog to complete then process
		dialogRef.afterClosed().subscribe( newData =>
		{
			// Only if we actually submitted
			if ( newData != undefined )
			{
				this.PKMNService.RemovePokemon( this.totalPokemon[ indexNumber ][ '_id' ] ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
				{
					if ( data[ 'message' ] == 'Pokemon removed' )
						this.totalPokemon.splice( indexNumber, 1 );
					else
						this.totalPokemon[ indexNumber ].defaultName = "Mew got herself stuck";
					
					// Re-Sort
					this.SortArray();
				});
			}
		});
	}
	
	SortArray()
	{
		// I still don't understand how does this work.
		this.totalPokemon.sort( ( a: any, b: any ) => a.dexID - b.dexID );
	}
}
