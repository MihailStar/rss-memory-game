/* eslint-disable no-underscore-dangle */
import { Card } from './card/card';
import { Cards, CardsEventPayload } from './cards/cards';
import { Component } from '../../scripts/component';
import {
  createCounter,
  defer,
  getRandomInt,
  shuffle,
} from '../../scripts/utilities';
import { logotypes } from '../../scripts/logotypes';

export type GameEventEndPayload = {
  count: ReturnType<ReturnType<typeof createCounter>['get']>;
  time: number;
};

export type GameOptions = {
  items: [3, 4 | 6] | [4, 3 | 4 | 5 | 6] | [5, 4 | 6] | [6, 3 | 4 | 5 | 6];
};

class Game implements Component {
  private readonly _cards: Cards;
  private _canMove: boolean;
  private _unopenedСards: number;
  private _moveСounter: ReturnType<typeof createCounter>;
  private _prevCard: Card | null;
  private _startTime: number | null;
  private readonly _$root: HTMLDivElement;

  constructor({ items: [itemsX, itemsY] }: GameOptions) {
    this._$root = document.createElement('div');
    this._$root.classList.add('game');
    this._$root.style.width = `${itemsX * 96 + (itemsX - 1) * 24}px`;

    const kinds = Array.from(
      { length: (itemsX * itemsY) / 2 },
      () => logotypes[getRandomInt(0, logotypes.length - 1)]
    );
    this._cards = new Cards({
      items: shuffle([...kinds, ...kinds]).map((kind) => ({ kind })),
    });
    this._cards.rootElement.addEventListener('event:click', (event) => {
      this.handleClick(event as CustomEvent<CardsEventPayload>);
    });
    this._cards.render(this._$root);

    this._canMove = true;
    this._moveСounter = createCounter();
    this._unopenedСards = itemsX * itemsY;
    this._prevCard = null;
    this._startTime = null;

    defer(() => {
      this._$root.dispatchEvent(new CustomEvent('event:init'));
    });
  }

  get rootElement(): HTMLDivElement {
    return this._$root;
  }

  render(container: HTMLElement): void {
    container.appendChild(this._$root);
  }

  private handleClick(event: CustomEvent<CardsEventPayload>): void {
    if (!this._canMove || event.detail.card.isOpen) {
      return;
    }

    if (this._startTime === null) {
      this._startTime = new Date().valueOf();
      this._$root.dispatchEvent(new CustomEvent('event:start'));
    }

    // eslint-disable-next-line no-param-reassign
    event.detail.card.isOpen = true;
    this._moveСounter.increment();

    if (this._prevCard === null) {
      this._prevCard = event.detail.card;
      return;
    }

    this._$root.classList.add('game_can-move_false');
    this._canMove = false;

    if (this._prevCard.kind === event.detail.card.kind) {
      this._unopenedСards -= 2;

      if (this._unopenedСards < 2) {
        this._$root.dispatchEvent(
          new CustomEvent<GameEventEndPayload>('event:end', {
            detail: {
              count: this._moveСounter.get(),
              time: new Date().valueOf() - this._startTime,
            },
          })
        );
        return;
      }

      this._prevCard = null;
      this._$root.classList.remove('game_can-move_false');
      this._canMove = true;
      return;
    }

    setTimeout(() => {
      // eslint-disable-next-line no-param-reassign
      event.detail.card.isOpen = false;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._prevCard!.isOpen = false;
      this._prevCard = null;
      this._$root.classList.remove('game_can-move_false');
      this._canMove = true;
    }, 900);
  }
}

export { Game };
