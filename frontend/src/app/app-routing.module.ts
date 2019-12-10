import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainMenuComponent } from './mainmenu/mainmenu.component';
import { PokemonComponent } from './pokemon/pokemon.component';
import { TeamManagerComponent } from './teammanager/teammanager.component';
import { InternalPKMNManagerComponent } from './internal-pkmnmanager/internal-pkmnmanager.component';
import { InternalMoveManagerComponent } from './internal-movemanager/internal-movemanager.component';
import { BattleComponent } from './battle/battle.component';

const routes: Routes =
[
	{ path: 'team', component: TeamManagerComponent },
	{ path: 'team/:teamID', component: PokemonComponent },
	{ path: 'battle', component: BattleComponent },
	{ path: 'i_pokemon', component: InternalPKMNManagerComponent },
	{ path: 'i_moves', component: InternalMoveManagerComponent },
	{ path: 'main', component: MainMenuComponent },
	{ path: '', redirectTo: '/main', pathMatch: 'full' }
];

@NgModule
({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class AppRoutingModule { }
