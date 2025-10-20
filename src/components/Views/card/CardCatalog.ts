import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { CDN_URL } from "../../../utils/constants";


export interface ICardAction {
  onClick?: () => void;
  deleteCard?: () => void;
  toogleCardBasket?: () => void;
}

export type CategoryKey = keyof typeof categoryMap;

export type TCardCatalog = Pick<IProduct, 'image' | 'category'>

export class CardCatalog extends Card<TCardCatalog> {
  protected _imageElement: HTMLImageElement;
  protected _categoryElement: HTMLElement;

  constructor(container: HTMLElement, action?: ICardAction) {
    super(container);

    this._categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this._imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (action?.onClick) {
       this.container.addEventListener('click', action?.onClick);
    }
}

  set image(src: string) {
    this.setImage(this._imageElement, CDN_URL + `${src.slice(0, -3) + 'png'}`, this.title)
  }

  set category(value: string) {
    this._categoryElement.textContent = value;

    for ( const key in categoryMap) {
      this._categoryElement.classList.toggle(categoryMap[key as CategoryKey], key == value);
    }
  }

}