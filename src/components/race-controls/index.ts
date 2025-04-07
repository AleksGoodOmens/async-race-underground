import { IStartResponse } from '../../api/carEngineControl';
import { getWinner } from '../../api/getWinner';
import { postWinner } from '../../api/postWinner';
import { updateWinner } from '../../api/updateWinner';
import { BaseElement } from '../../base/base-element';
import { Button } from '../button/button';
import { CarItem } from '../car-item/carItem';
import styles from './race-controls.module.css';

const data = {
  start: 'Start Race',
  reset: 'Reset Race',
  FIRST_INDEX: 0,
  ONE: 1,
  TWO_DIGITS: 2,
};

const classes = {
  container: styles['container'],
  start: styles['start'],
  reset: styles['reset'],
};

export class RaceControls {
  private _element: BaseElement<HTMLDivElement>;
  private _start: Button;
  private _reset: Button;

  public cars: CarItem[];
  constructor() {
    this.cars = [];

    this._element = new BaseElement({
      tag: 'div',
      className: classes.container,
    });
    this._start = new Button({
      className: classes.start,
      textContent: data.start,
      callback: () => this.handleStart(),
    });
    this._reset = new Button({
      className: classes.reset,
      textContent: data.reset,
      callback: () => this.handleReset(),
    });

    this._element.append(this._start.element, this._reset.element);
  }

  public get element() {
    return this._element.element;
  }

  private async handleStart() {
    const steady = await Promise.all(
      this.cars.map((car) => {
        if (car.id) return car.handleStart(car.id);
      })
    );

    this.handleMove(steady.filter((item) => item !== undefined));
  }

  private async handleMove(steady: IStartResponse[]) {
    const go = await Promise.allSettled(
      this.cars.map((car) => {
        const readyCar = steady.find((data) => data?.id === car?.id);
        if (readyCar) return car.handleMove(readyCar);
      })
    );

    const results = go
      .filter(
        (
          result
        ): result is PromiseFulfilledResult<{
          id: number;
          finish: boolean;
          time: number;
        }> =>
          result.status === 'fulfilled' && result.value
            ? result.value.time > data.FIRST_INDEX
            : false
      )
      .map((result) => result.value);

    results.sort((a, b) => a.time - b.time);

    const winner = results[data.FIRST_INDEX];

    const winnerAnimation = this.cars.find((car) => car.id === winner.id);
    winnerAnimation?.makeItWin(winner.time.toFixed(data.TWO_DIGITS));

    this.determineWinner(winner);
  }

  private async determineWinner(winner: {
    id: number;
    finish: boolean;
    time: number;
  }) {
    const secondWin = await getWinner(String(winner.id));

    console.log(secondWin);

    if (!secondWin) {
      await postWinner({ id: winner.id, wins: 1, time: winner.time });
      console.log('posted');
    } else {
      const bestTime = Math.min(secondWin.time, winner.time);
      const totalWins = secondWin.wins + data.ONE;
      const updated = await updateWinner({
        id: winner.id,
        time: bestTime,
        wins: totalWins,
      });
      console.log(updated);
    }
  }
  private async handleReset() {
    await Promise.all(
      this.cars.map((car) => {
        if (car.id) return car.handleStop(car.id);
      })
    );
  }
}
