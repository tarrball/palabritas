import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './1. features/game/game.component';

const routes: Routes = [
  {
    path: 'game',
    component: GameComponent,
  },
  {
    path: '**',
    redirectTo: 'game',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
