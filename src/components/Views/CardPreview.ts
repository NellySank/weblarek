import { IProduct } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { CategoryKey, ICardAction } from "./CardCatalog";
import { categoryMap } from "../../utils/constants";

type TCardPreview = Pick<IProduct, 'image' | 'category' | 'description'>

export class CardPreview extends Card<TCardPreview> {
  protected _imageElement: HTMLImageElement;
  protected _categoryElement: HTMLElement;
  protected _textElement: HTMLElement;
  protected _buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, action?: ICardAction) {
    super(container);

    this._categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this._imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this._textElement = ensureElement<HTMLElement>('.card__text', this.container);
    this._buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (action?.toogleCardBasket)
    {
      this._buttonElement.addEventListener('click', action?.toogleCardBasket);

    }


}
  set image(src: string) {
    this.setImage(this._imageElement, CDN_URL + `${src.slice(0, -3) + 'png'}`, this.title);
  }

  set category(value: string) {
    this._categoryElement.textContent = value;
    for ( const key in categoryMap) {
          this._categoryElement.classList.toggle(categoryMap[key as CategoryKey], key == value);
    }
  } 

  set description(value: string) {
    this._textElement.textContent = value;
  } 

  setTextButton(value: string) {
    this._buttonElement.textContent = value;
  }

  setDisableButton(isDisable: boolean) {
    this._buttonElement.disabled = isDisable;

  }

}