import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Pokemon, Move, Team } from './classes';

const httpOptions =
{
	headers: new HttpHeaders
	({
		'Content-Type': 'application/json'
	})
};

@Injectable
({
	providedIn: 'root'
})

/* This service handles all operations related to the various classes of the project */
export class ClassesService
{
	// Nothing will prevent the following code from being seen by everyone...
	// Here's hoping it doesn't affect the development of the project.
	
	private gAPIUrl = 'http://localhost:3000/rest';
	
	public arrTypeNames: string[] =
	[
		"Unassigned",
		"Normal",
		"Fighting",
		"Flying",
		"Poison",
		"Ground",
		"Rock",
		"Bug",
		"Ghost",
		"Steel",
		"Fire",
		"Water",
		"Grass",
		"Electric",
		"Psychic",
		"Ice",
		"Dragon",
		"Dark",
		"Fairy"
	];
	
	public arrCategoryNames: string[] =
	[
		"Physical",
		"Special",
		"Status"
	];
	
	constructor( private http: HttpClient ) { }
	
	// Returns all Pokemon whose name contains search term
	public GetPokemon( szSearchTerm: string ): Observable< Pokemon[] >
	{
		/*if ( !szSearchTerm.trim() )
		{
			// Nothing to search, nothing to return
			return of( [] );
		}*/
		
		return this.http.get< Pokemon[] >( `${this.gAPIUrl}/pokemonList/${szSearchTerm}` ).pipe
		(
			catchError( this.handleError )
		);
	}
	
	// Updates/Adds a Pokemon to the internal list
	public SavePokemon( newData: Pokemon, szAction: string, szOldName: string ): Observable< Pokemon[] >
	{
		// Directly send the HTTP request
		if ( szAction != 'new' )
		{
			// Update an existting pokemon
			return this.http.put< Pokemon[] >( `${this.gAPIUrl}/pokemonList/${szOldName}`, newData, httpOptions ).pipe
			(
				catchError( this.handleError )
			);
		}
		else
		{
			// Create new pokemon
			return this.http.post< Pokemon[] >( `${this.gAPIUrl}/pokemonList/`, newData, httpOptions ).pipe
			(
				catchError( this.handleError )
			);
		}
	}
	
	// Removes a Pokemon from the internal list
	public RemovePokemon( szPokemon: string ): Observable< any >
	{
		// Delete the team
		return this.http.delete< any >( `${this.gAPIUrl}/pokemonList/${szPokemon}`, httpOptions ).pipe
		(
			catchError( this.handleError )
		);
	}
	
	// Returns all Moves whose name contains search term
	public GetMove( szSearchTerm: string ): Observable< Move[] >
	{
		/*if ( !szSearchTerm.trim() )
		{
			// Nothing to search, nothing to return
			return of( [] );
		}*/
		
		return this.http.get< Move[] >( `${this.gAPIUrl}/moveList/${szSearchTerm}` ).pipe
		(
			catchError( this.handleError )
		);
	}
	
	// Updates/Adds a Move to the internal list
	public SaveMove( newData: Move, szAction: string, szOldName: string ): Observable< Move[] >
	{
		// Directly send the HTTP request
		if ( szAction != 'new' )
		{
			// Update an existting move
			return this.http.put< Move[] >( `${this.gAPIUrl}/moveList/${szOldName}`, newData, httpOptions ).pipe
			(
				catchError( this.handleError )
			);
		}
		else
		{
			// Create new move
			return this.http.post< Move[] >( `${this.gAPIUrl}/moveList/`, newData, httpOptions ).pipe
			(
				catchError( this.handleError )
			);
		}
	}
	
	// Removes a Move from the internal list
	public RemoveMove( szMove: string ): Observable< any >
	{
		// Delete the team
		return this.http.delete< any >( `${this.gAPIUrl}/moveList/${szMove}`, httpOptions ).pipe
		(
			catchError( this.handleError )
		);
	}
	
	// Returns all teams from a player
	public GetAllTeams( szUserName: string ): Observable< Team[] >
	{
		return this.http.get< Team[] >( `${this.gAPIUrl}/team/findall/${szUserName}` ).pipe
		(
			catchError( this.handleError )
		);
	}
	
	// Returns a player's Pokemon team
	public GetTeam( szTeamID: string ): Observable< Team[] >
	{
		if ( !szTeamID.trim() )
		{
			// No ID, nothing to return
			return of( [] );
		}
		
		return this.http.get< Team[] >( `${this.gAPIUrl}/team/findone/${szTeamID}` ).pipe
		(
			catchError( this.handleError )
		);
	}
	
	// Saves a player's Pokemon team
	public SaveTeam( playerTeam: Pokemon[], szTeamName: string, teamID: string ): Observable< Team[] >
	{
		// Build the data we are going to save
		let pre_SaveData = new Team();
		
		// Iterate through all entries of the player's team
		for ( let iMembers in playerTeam )
		{
			pre_SaveData.teamData.push( playerTeam[ iMembers ] );
		}
		
		// If there are less than 6 Pokemon, fill with empty space
		while ( pre_SaveData.teamData.length < 6 )
		{
			pre_SaveData.teamData.push( { dexID: 0, defaultName: "MissingNo.", customName: "", attributeType: [ 0, 0 ] } );
		}
		
		// Save the team's name
		pre_SaveData.teamName = szTeamName;
		
		// Now send the HTTP request
		if ( teamID != 'new' )
		{
			// Update an existting team
			return this.http.put< Team[] >( `${this.gAPIUrl}/team/findone/${teamID}`, pre_SaveData, httpOptions ).pipe
			(
				catchError( this.handleError )
			);
		}
		else
		{
			// Create new team
			pre_SaveData.userName = 'Giegue';
			return this.http.post< Team[] >( `${this.gAPIUrl}/team/`, pre_SaveData, httpOptions ).pipe
			(
				catchError( this.handleError )
			);
		}
	}
	
	// Sets a team as the active one for battles
	public SetActiveTeam( teamID: string ): Observable< Team[] >
	{
		// Set active argunment
		let bActive = { isActive: true };
		
		// HTTP request
		return this.http.put< Team[] >( `${this.gAPIUrl}/team/setactive/Giegue/${teamID}`, bActive, httpOptions ).pipe
		(
			catchError( this.handleError )
		);
	}
	
	// Gets the current active team
	public GetActiveTeam( /* szUserName: string */ ): Observable< Team >
	{
		// Simple request
		return this.http.get< Team >( `${this.gAPIUrl}/team/getactive/Giegue` ).pipe
		(
			catchError( this.handleError )
		);
	}
	
	// Removes a team
	public DeleteTeam( teamID: string ): Observable< any >
	{
		// Delete the team
		return this.http.delete< any >( `${this.gAPIUrl}/team/findone/${teamID}`, httpOptions ).pipe
		(
			catchError( this.handleError )
		);
	}
	
	// Execute a move
	public DoMove( attacker: Pokemon, target: Pokemon ): Observable< any >
	{
		// Build the JSON structure
		let pre_Data = [];
		
		pre_Data[ 'attacker' ] = attacker;
		pre_Data[ 'target' ] = target;
		//pre_Data[ 'moveID' ] = moveID;
		
		// Do the request
		return this.http.post< any >( `${this.gAPIUrl}/moveDo`, pre_Data, httpOptions ).pipe
		(
			catchError( this.handleError )
		);
	}
	
	private handleError( errorMsg: HttpErrorResponse )
	{
		if ( errorMsg.error instanceof ErrorEvent )
		{
			// Client-side or network error
			console.error( '[FRONTEND ERROR]', errorMsg.error.message );
		}
		else
		{
			console.error( `[BACKEND ERROR] Returned code ${errorMsg.status}, ` + `BODY: ${errorMsg.error}` );
		}
		
		// Notify
		return throwError( 'Mew got herself stuck...\nSomething bad happened; please try again later.' );
	}
}
