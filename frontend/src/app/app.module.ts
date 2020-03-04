import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
//import { PokemonComponent } from './pokemon/pokemon.component';
import { PopupsComponent } from './popups/popups.component';
import { MainMenuComponent } from './mainmenu/mainmenu.component';
//import { TeamManagerComponent } from './teammanager/teammanager.component';
import { InternalPKMNManagerComponent } from './internal-pkmnmanager/internal-pkmnmanager.component';
//import { InternalMoveManagerComponent } from './internal-movemanager/internal-movemanager.component';
//import { BattleComponent } from './battle/battle.component';

@NgModule
({
	declarations:
	[
		AppComponent,
		//PokemonComponent,
		PopupsComponent,
		MainMenuComponent,
		//TeamManagerComponent,
		InternalPKMNManagerComponent,
		//InternalMoveManagerComponent,
		//BattleComponent
	],
	imports:
	[
		BrowserModule,
		HttpClientModule,
		NoopAnimationsModule,
		MatDialogModule,
		MatInputModule,
		MatSelectModule,
		DragDropModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent],
	entryComponents:
	[
		PopupsComponent
	]
})

export class AppModule { }
