import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ClassesService } from '../classes.service';
import { PopupsComponent } from '../popups/popups.component';
import { Pokemon } from '../classes';
import { Team } from '../classes';

@Component
({
	selector: 'app-teammanager',
	templateUrl: './teammanager.component.html',
	styleUrls: ['./teammanager.component.css']
})

export class TeamManagerComponent implements OnInit, OnDestroy
{
	totalTeams: Team[] = [];
	teamRowSpan: number[] = [];
	teamID: string[] = [];
	
	destroy$: Subject< boolean > = new Subject< boolean >();
	
	constructor( private PKMNService: ClassesService, private matDialog: MatDialog ) { }
	
	ngOnInit()
	{
		this.PKMNService.GetAllTeams( 'Giegue' ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
		{
			for ( let iTeam in data )
			{
				// No teams?
				if ( data.length > 0 )
				{
					// Get team data
					this.totalTeams.push( data[ iTeam ] );
					
					// Remove empty members from the rowspan
					let iRowSpan = 6;
					for ( let iMissingNo in data[ iTeam ].teamData )
					{
						if ( data[ iTeam ].teamData[ iMissingNo ].dexID == 0 )
							iRowSpan--;
					}
					
					// Set team's rowspan for display
					this.teamRowSpan.push( iRowSpan );
					
					// Old data?
					if ( data[ iTeam ].isActive == null )
						data[ iTeam ][ 'isActive' ] = false; // define
					
					// Save team's internal ID
					this.teamID.push( data[ iTeam ][ '_id' ] );
				}
			}
		});
	}
	
	deleteTeam( teamIndex: number )
	{
		// Initialize delete dialog box
		const dialogConfig = new MatDialogConfig();
		dialogConfig.data =
		{
			doFunction: 'DELETE TEAM',
			szTeamName: this.totalTeams[ teamIndex ].teamName
		};
		
		// Popup the delete box
		let dialogRef = this.matDialog.open( PopupsComponent, dialogConfig );
		
		// Wait for dialog to complete then process
		dialogRef.afterClosed().subscribe( shouldDelete =>
		{
			// Only if we actually confirmed our delete
			if ( shouldDelete != undefined )
			{
				this.PKMNService.DeleteTeam( this.teamID[ teamIndex ] ).pipe( takeUntil( this.destroy$ ) ).subscribe( data =>
				{
					if ( data[ 'message' ] == 'Team removed' )
						this.totalTeams.splice( teamIndex, 1 );
					else
						this.totalTeams[ teamIndex ].teamName = "Mew got herself stuck";
				});
			}
		});
	}
	
	ngOnDestroy()
	{
		this.destroy$.next( true );
		this.destroy$.unsubscribe();
	}
}
