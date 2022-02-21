/* eslint-disable no-underscore-dangle */
import { Card, CardOptions } from '../card/card';
import { Component } from '../../../scripts/component';
import { defer } from '../../../scripts/utilities';

export type CardsEventPayload = { cards: Card[]; card: Card };

export type CardsOptions = {
  items: CardOptions[];
};

class Cards implements Component {
  private readonly _cards: Card[];
  private readonly _$root: HTMLDivElement;

  constructor({ items: cardsOptions }: CardsOptions) {
    this._$root = document.createElement('div');
    this._$root.classList.add('cards');
    this._cards = cardsOptions.map((cardOptions) => new Card(cardOptions));
    this._cards.forEach((card) => {
      card.rootElement.addEventListener('event:click', () => {
        this.handleClick(card);
      });
      card.rootElement.addEventListener('event:change', () => {
        this.handleChange(card);
      });
      card.render(this._$root);
    });
    defer(() => {
      this._$root.dispatchEvent(
        new CustomEvent<Omit<CardsEventPayload, 'card'>>('event:init', {
          detail: { cards: [...this._cards] },
        })
      );
    });
  }

  get rootElement(): HTMLDivElement {
    return this._$root;
  }

  render(container: HTMLElement): void {
    container.appendChild(this._$root);
  }

  private handleClick(card: Card): void {
    this._$root.dispatchEvent(
      new CustomEvent<CardsEventPayload>('event:click', {
        detail: { cards: [...this._cards], card },
      })
    );
  }

  private handleChange(card: Card): void {
    this._$root.dispatchEvent(
      new CustomEvent<CardsEventPayload>('event:change', {
        detail: { cards: [...this._cards], card },
      })
    );
  }
}

export { Cards };
