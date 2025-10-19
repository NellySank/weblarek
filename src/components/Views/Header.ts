import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
  basketCounter: number;
}

export class Header extends Component<IHeader> {
  protected _counterElement: HTMLElement;
  protected _buttonElement: HTMLButtonElement;

  constructor(protected _events: IEvents, container: HTMLElement) {
    super(container)

    this._counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this._buttonElement = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    this._buttonElement.addEventListener('click', () => {
      this._events.emit('basket:open');
    })

  }

  set counter (value: number) {
    this._counterElement.textContent = String(value);
  }
}