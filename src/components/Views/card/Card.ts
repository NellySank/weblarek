import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export type TCardBase = Pick<IProduct, 'title' | 'price'>;

export class Card<TCardBase> extends Component<TCardBase> {
  protected _titleElement: HTMLElement;
  protected _priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this._priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    this._titleElement.textContent = value;
  }

  set price(value: number) {
    this._priceElement.textContent = value ? String(value) + ' синапсов' : 'Бесценно';
  }

}