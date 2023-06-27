import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  newGameRequested,
  revealGameRequested,
} from 'src/app/2. store/game/game.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent {
  constructor(private readonly store: Store) {}

  public clickNewGame(): void {
    this.store.dispatch(newGameRequested());
  }

  public revealAnswers(): void {
    this.store.dispatch(revealGameRequested());
  }
}
