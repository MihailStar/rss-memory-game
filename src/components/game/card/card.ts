/* eslint-disable no-underscore-dangle */
import { Component } from '../../../scripts/component';
import { createElementFromTemplate, defer } from '../../../scripts/utilities';
import { logotypes } from '../../../scripts/logotypes';

export type CardEventPayload = { card: Card };

export type CardOptions = {
  kind: typeof logotypes[number];
  imageUrl?: `./images/logotypes/${CardOptions['kind']}.png`;
  isOpen?: boolean;
};

class Card implements Component {
  private readonly _kind: typeof logotypes[number];
  private _isOpen: boolean;
  private readonly _$root: HTMLDivElement;

  constructor({
    kind,
    imageUrl = `./images/logotypes/${kind}.png`,
    isOpen = false,
  }: CardOptions) {
    this._kind = kind;
    this._isOpen = isOpen;
    const template = `
      <div class="${this.isOpen ? 'card card_open' : 'card'}">
        <div class="card__rotating-container">
          <div class="card__front-side">JS</div>
          <div class="card__back-side" style="background-image: url(${imageUrl})"></div>
        </div>
      </div>
    `.replace(/(\n| {2,})/g, '');
    this._$root = createElementFromTemplate<HTMLDivElement>(template);
    this._$root.addEventListener('click', this);
    defer(() => {
      this._$root.dispatchEvent(
        new CustomEvent<CardEventPayload>('event:init', {
          detail: { card: this },
        })
      );
    });
  }

  get kind(): typeof logotypes[number] {
    return this._kind;
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  set isOpen(value: boolean) {
    this._isOpen = value;
    this._$root.classList[this._isOpen ? 'add' : 'remove']('card_open');
    this._$root.dispatchEvent(
      new CustomEvent<CardEventPayload>('event:change', {
        detail: { card: this },
      })
    );
  }

  get rootElement(): HTMLDivElement {
    return this._$root;
  }

  render(container: HTMLElement): void {
    container.appendChild(this._$root);
  }

  handleEvent(event: Event): void {
    if (event.type === 'click') {
      this.heandleClick();
    }
  }

  private heandleClick(): void {
    this._$root.dispatchEvent(
      new CustomEvent<CardEventPayload>('event:click', {
        detail: { card: this },
      })
    );
  }
}

export { Card };
