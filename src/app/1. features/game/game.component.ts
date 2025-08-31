import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, filter } from 'rxjs';
import {
  letterTapped,
  newGameAfterCompletion,
  wordSubmitted,
  shuffleRequested,
} from 'src/app/2. store/game/game.actions';
import {
  selectAnswers,
  selectClickableLetters,
  selectClickedLetters,
  selectEarnedPoints,
  selectIsGameComplete,
  selectMostRecentAnswer,
  selectPotentialPoints,
  selectScore,
} from 'src/app/2. store/game/game.selectors';
import { Answer, Letter } from 'src/app/2. store/game/game.state';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class GameComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly store = inject(Store);

  public answers$: Observable<Answer[]>;
  public clickableLetters$: Observable<Letter[]>;
  public clickedLetters$: Observable<Letter[]>;
  public earnedPoints$: Observable<number>;
  public potentialPoints$: Observable<number>;
  public isGameComplete$: Observable<boolean>;
  public score$: Observable<number>;
  public mostRecentAnswer$: Observable<string | undefined>;

  constructor() {
    this.answers$ = this.store.select(selectAnswers);
    this.clickableLetters$ = this.store.select(selectClickableLetters);
    this.clickedLetters$ = this.store.select(selectClickedLetters);
    this.earnedPoints$ = this.store.select(selectEarnedPoints);
    this.potentialPoints$ = this.store.select(selectPotentialPoints);
    this.isGameComplete$ = this.store.select(selectIsGameComplete);
    this.score$ = this.store.select(selectScore);
    this.mostRecentAnswer$ = this.store.select(selectMostRecentAnswer);
  }

  public ngOnInit(): void {
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

  /**
   * Handles letter click events by dispatching a letterTapped action
   * @param letter The letter object containing the index to tap
   */
  public clickLetter({ index }: Letter): void {
    this.store.dispatch(letterTapped({ index }));
  }

  /**
   * Handles enter button click events
   * @param isGameComplete Whether the current game is complete
   */
  public clickEnter(isGameComplete: boolean): void {
    if (isGameComplete) {
      this.store.dispatch(newGameAfterCompletion());
    } else {
      this.store.dispatch(wordSubmitted());
    }
  }

  /**
   * Handles shuffle button click events by requesting letter rearrangement
   */
  public clickShuffle(): void {
    this.store.dispatch(shuffleRequested());
  }

  /**
   * Calculates animation delay for letter drop effect
   * @param answer The answer being displayed
   * @param letterIndex The index of the letter in the word
   * @param recentAnswer The most recently found answer
   * @returns Animation delay in milliseconds
   */
  public getLetterAnimationDelay(
    answer: Answer,
    letterIndex: number,
    recentAnswer: string | null | undefined
  ): number {
    if (answer.word === recentAnswer && answer.state !== 'not-found') {
      return 200 + letterIndex * 100;
    }
    return 0;
  }

  /**
   * Determines if letter should have drop animation
   * @param answer The answer being displayed
   * @param recentAnswer The most recently found answer
   * @returns True if letter should animate
   */
  public shouldAnimateLetter(
    answer: Answer,
    recentAnswer: string | null | undefined
  ): boolean {
    return answer.word === recentAnswer && answer.state !== 'not-found';
  }

  /**
   * TrackBy function for letter arrays to optimize change detection
   * @param index The index of the item in the array
   * @param letter The letter object
   * @returns Unique tracking key combining index and value
   */
  public trackByLetterIndexValue(index: number, letter: Letter): string {
    return letter.index + '-' + letter.value;
  }
}
