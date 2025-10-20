import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  total: number;
  catalog: HTMLElement[];
  isDisableButton: boolean;
}

export class BasketModal extends Component<IBasket> {
  protected _catalogElement: HTMLElement;
  protected _buttonElement: HTMLButtonElement;
  protected _totalPriceElement: HTMLElement;

  constructor(protected _events: IEvents, container: HTMLElement) {

    super(container)
  
      this._catalogElement = ensureElement<HTMLElement>('.basket__list', this.container);
      this._catalogElement.innerHTML = 'Корзина пуста';
      this._totalPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);
      this._buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

      this._buttonElement.addEventListener('click', () => {
        this._events.emit('basket:order');
      })
    }

    set total(value: number) {
      this._totalPriceElement.textContent = String(value) + ' синапсов';
    }

    set catalog(items: HTMLElement[]) {
      
      if (items.length === 0) {
        this._catalogElement.innerHTML = 'Корзина пуста';
      } else {
        this._catalogElement.innerHTML = '';
        items.forEach((item) => {
        this._catalogElement.append(item);
      });

      }
      
  }

  setButtonDisable(isDisable: boolean) {
    this._buttonElement.disabled = isDisable;
  }

}