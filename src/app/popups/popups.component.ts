import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { Pokemon, Move } from '../classes';

@Component
({
	selector: 'app-popups',
	templateUrl: './popups.component.html',
	styleUrls: ['./popups.component.css']
})

export class PopupsComponent implements OnInit
{
	szTitle: string = '';
	szOperation: string = '';
	
	dialogRenameControl = new FormControl( ( this.data.Pokemon == null ? '' : this.data.Pokemon.customName ), [ Validators.maxLength( 12 ) ] );
	dialogMoveControl = new FormControl( '', [ Validators.pattern( '^[1-6]*$' ), Validators.maxLength( 1 ) ] );
	dialogRenameTeamControl = new FormControl( ( this.data.szCurrentName == null ? '' : this.data.szCurrentName ), [ Validators.maxLength( 16 ) ] );
	
	dEditInternalPKMNControl_dexID = new FormControl( ( this.data.Pokemon == null ? '' : this.data.Pokemon.dexID ), [ Validators.required, Validators.pattern( '^[0-9]*$' ) ] );
	dEditInternalPKMNControl_defaultName = new FormControl( ( this.data.Pokemon == null ? '' : this.data.Pokemon.defaultName ), [ Validators.required ] );
	dEditInternalPKMNControl_attributeType1 = new FormControl( ( this.data.Pokemon == null ? '' : this.data.Pokemon.attributeType[ 0 ] ), [ Validators.required, Validators.pattern( '^[1-9][0-9]*$' ) ] );
	dEditInternalPKMNControl_attributeType2 = new FormControl( ( this.data.Pokemon == null ? '' : this.data.Pokemon.attributeType[ 1 ] ), [ Validators.required ] );
	
	dEditInternalMoveControl_moveName = new FormControl( ( this.data.Move == null ? '' : this.data.Move.moveName ), [ Validators.required ] );
	dEditInternalMoveControl_moveDescription = new FormControl( ( this.data.Move == null ? '' : this.data.Move.moveDescription ), [ Validators.required ] );
	dEditInternalMoveControl_moveAccuracy = new FormControl( ( this.data.Move == null ? '' : this.data.Move.moveAccuracy ), [ Validators.required, Validators.pattern( '^[1-9][0-9]*$' ) ] );
	dEditInternalMoveControl_movePower = new FormControl( ( this.data.Move == null ? '' : this.data.Move.movePower ), [ Validators.required, Validators.pattern( '^[1-9][0-9]*$' ) ] );
	dEditInternalMoveControl_movePP = new FormControl( ( this.data.Move == null ? '' : this.data.Move.movePP ), [ Validators.required, Validators.pattern( '^[1-9][0-9]*$' ) ] );
	dEditInternalMoveControl_moveCategory = new FormControl( ( this.data.Move == null ? '' : this.data.Move.moveCategory ), [ Validators.required ] );
	dEditInternalMoveControl_moveType = new FormControl( ( this.data.Move == null ? '' : this.data.Move.moveAttribute ), [ Validators.required, Validators.pattern( '^[1-9][0-9]*$' ) ] );
	
	matcher = new MyErrorStateMatcher();
	
	constructor( public dialogRef: MatDialogRef< PopupsComponent >, @Inject( MAT_DIALOG_DATA ) public data: any ) { }
	
	ngOnInit()
	{
		this.szOperation = this.data.doFunction;
		
		// Initializate component. Get operation to perform
		if ( this.szOperation == 'RENAME' )
		{
			// Rename operation, get Pokemon to rename
			
			// Get custom name if applicable, use default otherwise
			if ( this.data.Pokemon.customName.length )
				this.szTitle = `What shall ${this.data.Pokemon.customName}'` + ( this.data.Pokemon.customName.endsWith( 's' ) ? '' : 's' ) + ' new name be?';
			else
				this.szTitle = `What shall ${this.data.Pokemon.defaultName}'` + ( this.data.Pokemon.defaultName.endsWith( 's' ) ? '' : 's' ) + ' new name be?';
			this.szTitle += '<br/>Leave blank to use species name.';
		}
		else if ( this.szOperation == 'MOVE' )
		{
			// Move operation, get Pokemon to swap for
			
			// Hold. There must be more than 1 team member
			if ( this.data.iTeamMembers == 1 )
				this.szTitle += 'Cannot move with just one Pokemon.';
			else
			{
				// Get custom name if applicable, use default otherwise
				if ( this.data.Pokemon.customName.length )
					this.szTitle = `Choose a new position for ${this.data.Pokemon.customName}.`;
				else
					this.szTitle = `Choose a new position for ${this.data.Pokemon.defaultName}.`;
				this.szTitle += '<br/>Positions goes from 1 to 6.';
			}
		}
		else if ( this.szOperation == 'DELETE' )
		{
			// Delete operation, get Pokemon to remove from the list
			
			// Get custom name if applicable, use default otherwise
			if ( this.data.Pokemon.customName.length )
				this.szTitle = `Release ${this.data.Pokemon.customName} from the team?`;
			else
				this.szTitle = `Release ${this.data.Pokemon.defaultName} from the team?`;
			this.szTitle += '<br/>All progress done with this Pokemon will be lost.';
		}
		else if ( this.szOperation == 'RENAME TEAM' )
		{
			// Simple, rename team operation
			this.szTitle = `What shall this team's new name be?`;
		}
		else if ( this.szOperation == 'DELETE TEAM' )
		{
			// Simple, delete team operation
			this.szTitle = `Disband "${this.data.szTeamName}"?`;
			this.szTitle += `<br/>The team will be removed and all Pokemon composing it will be released.`;
		}
		else if ( this.szOperation == 'ADD INTERNAL POKEMON' )
		{
			// Internal use
			this.szTitle = `Add new Pokemon`;
		}
		else if ( this.szOperation == 'EDIT INTERNAL POKEMON' )
		{
			// Internal use
			this.szTitle = `Edit Pokemon`;
		}
		else if ( this.szOperation == 'DELETE INTERNAL POKEMON' )
		{
			// Internal use
			this.szTitle = `<b>YOU ARE DELETING FROM THE INTERNAL DATABASE</b>`;
			this.szTitle += `<br/>All players will lose the Pokemon "${this.data.Pokemon.defaultName}" and any remnants will become unexistant.`;
			this.szTitle += `<br/>Absolutely sure to delete?`;
		}
		else if ( this.szOperation == 'ADD INTERNAL MOVE' )
		{
			// Internal use
			this.szTitle = `Add new Move`;
		}
		else if ( this.szOperation == 'EDIT INTERNAL MOVE' )
		{
			// Internal use
			this.szTitle = `Edit Move`;
		}
		else if ( this.szOperation == 'DELETE INTERNAL MOVE' )
		{
			// Internal use
			this.szTitle = `<b>YOU ARE DELETING FROM THE INTERNAL DATABASE</b>`;
			this.szTitle += `<br/>All players will lose the Move "${this.data.Move.moveName}" and any remnants will become unexistant.`;
			this.szTitle += `<br/>Absolutely sure to delete?`;
		}
	}
	
	close()
	{
		this.dialogRef.close();
	}
	
	rename()
	{
		if ( !this.dialogRenameControl.invalid )
			this.dialogRef.close( this.dialogRenameControl.value );
	}
	
	move()
	{
		if ( !this.dialogMoveControl.invalid )
			this.dialogRef.close( this.dialogMoveControl.value );
	}
	
	delete()
	{
		this.dialogRef.close( "CONFIRM" );
	}
	
	renameTeam()
	{
		if ( !this.dialogRenameTeamControl.invalid )
			this.dialogRef.close( this.dialogRenameTeamControl.value );
	}
	
	updatePokemon()
	{
		if ( !this.dEditInternalPKMNControl_dexID.invalid && !this.dEditInternalPKMNControl_defaultName.invalid && !this.dEditInternalPKMNControl_attributeType1.invalid && !this.dEditInternalPKMNControl_attributeType2.invalid )
		{
			let returnValue = new Pokemon();
			returnValue.dexID = this.dEditInternalPKMNControl_dexID.value;
			returnValue.defaultName = this.dEditInternalPKMNControl_defaultName.value;
			returnValue.attributeType = [ this.dEditInternalPKMNControl_attributeType1.value, this.dEditInternalPKMNControl_attributeType2.value ];
			
			this.dialogRef.close( returnValue );
		}
	}
	
	updateMove()
	{
		if ( !this.dEditInternalMoveControl_moveName.invalid && !this.dEditInternalMoveControl_moveDescription.invalid && !this.dEditInternalMoveControl_moveAccuracy.invalid && !this.dEditInternalMoveControl_movePower.invalid && !this.dEditInternalMoveControl_movePP.invalid && !this.dEditInternalMoveControl_moveCategory.invalid && !this.dEditInternalMoveControl_moveType.invalid )
		{
			let returnValue = new Move();
			returnValue.moveName = this.dEditInternalMoveControl_moveName.value;
			returnValue.moveDescription = this.dEditInternalMoveControl_moveDescription.value;
			returnValue.moveAccuracy = this.dEditInternalMoveControl_moveAccuracy.value;
			returnValue.movePower = this.dEditInternalMoveControl_movePower.value;
			returnValue.movePP = this.dEditInternalMoveControl_movePP.value;
			returnValue.moveCategory = this.dEditInternalMoveControl_moveCategory.value;
			returnValue.moveAttribute = this.dEditInternalMoveControl_moveType.value;
			
			this.dialogRef.close( returnValue );
		}
	}
}

/* Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher
{
	isErrorState( control: FormControl | null, form: FormGroupDirective | NgForm | null ): boolean
	{
		const isSubmitted = form && form.submitted;
		return !!( control && control.invalid && ( control.dirty || control.touched || isSubmitted ) );
	}
}
