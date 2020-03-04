import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BasePokemon, PlayerPokemon, Move, Team } from './classes';

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
	
	// Returns all Pokemon
	public GetPokemon(): Observable< BasePokemon[] >
	{
		return this.http.get< BasePokemon[] >( `${this.gAPIUrl}/pokemonList/` ).pipe
		(
			catchError( this.handleError )
		);
	}
	
	// Updates/Adds a Pokemon to the internal list
	public SavePokemon( newData: BasePokemon, szAction: string, szPokemonID: string ): Observable< BasePokemon[] >
	{
		// Directly send the HTTP request
		if ( szAction != 'new' )
		{
			// Update an existting pokemon
			return this.http.put< BasePokemon[] >( `${this.gAPIUrl}/pokemonList/${szPokemonID}`, newData, httpOptions ).pipe
			(
				catchError( this.handleError )
			);
		}
		else
		{
			// Create new pokemon
			return this.http.post< BasePokemon[] >( `${this.gAPIUrl}/pokemonList/`, newData, httpOptions ).pipe
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
	public GetAllTeams(): Observable< Team[] >
	{
		return this.http.get< Team[] >( `${this.gAPIUrl}/team/findall` ).pipe
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
	public SaveTeam( playerTeam: PlayerPokemon[], szTeamName: string, teamID: string ): Observable< Team[] >
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
			let dummyData = new PlayerPokemon();
			dummyData.baseID = "NULL";
			dummyData.customName = "MissingNo.";
			dummyData.currentHP = -1;
			dummyData.statEV = [ -1, -1, -1, -1, -1, -1 ];
			dummyData.statIV = [ -1, -1, -1, -1, -1, -1 ];
			dummyData.statNature = -1;
			dummyData.expPoints = -1;
			dummyData.moveIDList = [ "NULL", "NULL", "NULL", "NULL" ];
			
			pre_SaveData.teamData.push( dummyData );
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
		return this.http.put< Team[] >( `${this.gAPIUrl}/team/setactive/${teamID}`, bActive, httpOptions ).pipe
		(
			catchError( this.handleError )
		);
	}
	
	// Gets the current active team
	public GetActiveTeam(): Observable< Team >
	{
		// Simple request
		return this.http.get< Team >( `${this.gAPIUrl}/team/getactive` ).pipe
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
	public DoMove(): void
	{
		/* OUTDATED. This function does nothing until battle rework.
		
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
		*/
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
