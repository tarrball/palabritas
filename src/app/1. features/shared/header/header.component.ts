import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import {
  newGameRequested,
  revealGameRequested,
} from 'src/app/2. store/game/game.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule],
})
export class HeaderComponent {
  private readonly store = inject(Store);

  /**
   * Handles new game button click events
   */
  public clickNewGame(): void {
    this.store.dispatch(newGameRequested());
  }

  /**
   * Handles reveal answers button click events
   */
  public revealAnswers(): void {
    this.store.dispatch(revealGameRequested());
  }
}
