import { ensureElement } from "../../utils/utils";
import { Card, TCardBase } from "./Card";
import { ICardAction } from "./CardCatalog";

type TCardBasket = TCardBase;

export class CardBasket extends Card<TCardBasket> {
  protected _deleteButtonElement: HTMLButtonElement;
  
  constructor(container: HTMLElement,  action?: ICardAction) {
    super(container);
    this._deleteButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (action?.deleteCard) {
       this._deleteButtonElement.addEventListener('click', action?.deleteCard);
    }
  }

 set title(value: string) {
    this._titleElement.textContent = value;
  }

  set price(value: number) {
    this._priceElement.textContent = String(value);
  }

}