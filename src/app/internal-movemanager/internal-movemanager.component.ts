import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ClassesService } from '../classes.service';
import { PopupsComponent } from '../popups/popups.component';
import { Move } from '../classes';

@Component
({
	selector: 'app-internal-movemanager',
	templateUrl: './internal-movemanager.component.html',
	styleUrls: ['./internal-movemanager.component.css']
})

export class InternalMoveManagerComponent implements OnInit
{
	totalMove: Move[] = [];
	
	destroy$: Subject< boolean > = new Subject< boolean >();
	
	constructor( private PKMNService: ClassesService, private matDialog: MatDialog ) { }
	
	ngOnInit()
	{
		// Get all currently exsistting Moves
		this.PKMNService.GetMove( '' ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
		{
			for ( let iMove in data )
			{
				// Add to list
				this.totalMove.push( data[ iMove ] );
			}
			
			// Sort
			this.SortArray();
		});
	}
	
	getType( move: Move )
	{
		let szReturn = '';
		
		if ( move.moveAttribute == null )
			szReturn = 'Undefined';
		else
			szReturn = this.PKMNService.arrTypeNames[ move.moveAttribute ];
		
		return szReturn;
	}
	
	getCategory( move: Move )
	{
		let szReturn = '';
		
		if ( move.moveCategory == null )
			szReturn = 'Undefined';
		else
			szReturn = this.PKMNService.arrCategoryNames[ move.moveCategory ];
		
		return szReturn;
	}
	
	addMove()
	{
		// Initialize dialog box
		const dialogConfig = new MatDialogConfig();
		dialogConfig.data =
		{
			doFunction: 'ADD INTERNAL MOVE',
			arrTypes: this.PKMNService.arrTypeNames,
			arrCategories: this.PKMNService.arrCategoryNames
		};
		
		// Popup the rename box
		let dialogRef = this.matDialog.open( PopupsComponent, dialogConfig );
		
		// Wait for dialog to complete then process
		dialogRef.afterClosed().subscribe( newData =>
		{
			// Only if we actually submitted
			if ( newData != undefined )
			{
				this.PKMNService.SaveMove( newData, 'new', '------' ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
				{
					// Update the entries
					this.totalMove.push( newData );
					
					// Re-Sort
					this.SortArray();
				});
			}
		});
	}
	
	editMove( move: Move )
	{
		// Initialize dialog box
		const dialogConfig = new MatDialogConfig();
		dialogConfig.data =
		{
			Move: move,
			doFunction: 'EDIT INTERNAL MOVE',
			arrTypes: this.PKMNService.arrTypeNames,
			arrCategories: this.PKMNService.arrCategoryNames
		};
		
		// Popup the rename box
		let dialogRef = this.matDialog.open( PopupsComponent, dialogConfig );
		
		// Wait for dialog to complete then process
		dialogRef.afterClosed().subscribe( newData =>
		{
			// Only if we actually submitted
			if ( newData != undefined )
			{
				this.PKMNService.SaveMove( newData, 'update', move.moveName ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
				{
					// Update the entries
					move.moveName = newData.moveName;
					move.moveDescription = newData.moveDescription;
					move.moveAccuracy = newData.moveAccuracy;
					move.movePower = newData.movePower;
					move.movePP = newData.movePP;
					move.moveCategory = newData.moveCategory;
					move.moveAttribute = newData.moveAttribute;
				});
				
				// Re-Sort
				this.SortArray();
			}
		});
	}
	
	deleteMove( indexNumber: number )
	{
		// Initialize dialog box
		const dialogConfig = new MatDialogConfig();
		dialogConfig.data =
		{
			Move: this.totalMove[ indexNumber ],
			doFunction: 'DELETE INTERNAL MOVE'
		};
		
		// Popup the rename box
		let dialogRef = this.matDialog.open( PopupsComponent, dialogConfig );
		
		// Wait for dialog to complete then process
		dialogRef.afterClosed().subscribe( newData =>
		{
			// Only if we actually submitted
			if ( newData != undefined )
			{
				this.PKMNService.RemoveMove( this.totalMove[ indexNumber ].moveName ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
				{
					if ( data[ 'message' ] == 'Move removed' )
						this.totalMove.splice( indexNumber, 1 );
					else
						this.totalMove[ indexNumber ].moveName = "Mew got herself stuck";
					
					// Re-Sort
					this.SortArray();
				});
			}
		});
	}
	
	SortArray()
	{
		// Sort by name
		this.totalMove.sort( ( a: any, b: any ) => a.moveName.localeCompare( b.moveName ) );
	}
}
