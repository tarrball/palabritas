import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter } from 'rxjs';
import {
  letterTapped,
  newGameRequested,
  wordSubmitted,
} from 'src/app/2. store/game/game.actions';
import {
  selectAnswers,
  selectClickableLetters,
  selectClickedLetters,
  selectMostRecentAnswer,
} from 'src/app/2. store/game/game.selectors';
import { Answer, Letter } from 'src/app/2. store/game/game.state';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
})
export class GameComponent implements OnInit {
  public answers$: Observable<Answer[]>;
  public clickableLetters$: Observable<Letter[]>;
  public clickedLetters$: Observable<Letter[]>;

  constructor(private readonly store: Store) {
    this.answers$ = this.store.select(selectAnswers);
    this.clickableLetters$ = this.store.select(selectClickableLetters);
    this.clickedLetters$ = this.store.select(selectClickedLetters);
  }

  public ngOnInit(): void {
    this.store.dispatch(newGameRequested());

    this.store
      .select(selectMostRecentAnswer)
      .pipe(filter((answer) => !!answer))
      .subscribe((answer) => this.scrollToRevealedAnswer(answer!));
  }

  private scrollToRevealedAnswer(answer: string): void {
    const answerElement = document.getElementById(answer);
    answerElement?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }

  public clickLetter({ index }: Letter): void {
    this.store.dispatch(letterTapped({ index }));
  }

  public clickEnter(): void {
    this.store.dispatch(wordSubmitted());
  }

  public clickNewGame(): void {
    this.store.dispatch(newGameRequested());
  }
}
