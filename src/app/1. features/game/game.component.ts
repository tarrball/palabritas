import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
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
  selectEarnedPoints,
  selectMostRecentAnswer,
  selectPotentialPoints,
} from 'src/app/2. store/game/game.selectors';
import { Answer, Letter } from 'src/app/2. store/game/game.state';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class GameComponent implements OnInit {
  public answers$: Observable<Answer[]>;
  public clickableLetters$: Observable<Letter[]>;
  public clickedLetters$: Observable<Letter[]>;
  public earnedPoints$: Observable<number>;
  public potentialPoints$: Observable<number>;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly store: Store
  ) {
    this.answers$ = this.store.select(selectAnswers);
    this.clickableLetters$ = this.store.select(selectClickableLetters);
    this.clickedLetters$ = this.store.select(selectClickedLetters);
    this.earnedPoints$ = this.store.select(selectEarnedPoints);
    this.potentialPoints$ = this.store.select(selectPotentialPoints);
  }

  public ngOnInit(): void {
    this.store.dispatch(newGameRequested());

    this.store
      .select(selectMostRecentAnswer)
      // falsy are filtered out so we can safely use the non-null assertion operator
      .pipe(filter((answer) => !!answer))
      .subscribe((answer) => this.scrollToRevealedAnswer(answer!));
  }

  private scrollToRevealedAnswer(answer: string): void {
    const answerElement = this.document.getElementById(answer);
    answerElement?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }

  public clickLetter({ index }: Letter): void {
    this.store.dispatch(letterTapped({ index }));
  }

  public clickEnter(): void {
    this.store.dispatch(wordSubmitted());
  }
}
