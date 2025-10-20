import { ensureElement } from "../../../utils/utils";
import { Card, TCardBase } from "./Card";
import { ICardAction } from "./CardCatalog";

type TCardBasket = TCardBase & { index: number };

export class CardBasket extends Card<TCardBasket> {
  protected _deleteButtonElement: HTMLButtonElement;
  protected _indexElement: HTMLElement;
  
  constructor(container: HTMLElement,  action?: ICardAction) {
    super(container);
    this._deleteButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this._indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);


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

   set index(value: number) {
    this._indexElement.textContent = String(value);
  }

}