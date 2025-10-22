import { IBuyer } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, IFormAction } from "./Form";

export interface IFormContacts {
  email: string;
  phone: string;
  isDisableButton: boolean;
}

export class FormContact extends Form<IFormContacts> {
  protected _emailElement: HTMLInputElement;
  protected _phoneElement: HTMLInputElement;

  constructor(protected _events: IEvents, container: HTMLElement, actions?: IFormAction) {
    super(container, actions);

    this._emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this._phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);


    this._emailElement.addEventListener('input', () => {
      const buyerEmail: Partial<IBuyer> = {email: this._emailElement.value}
      this._events.emit('email:change', buyerEmail);
    });

     this._phoneElement.addEventListener('input', () => {
      const buyerPhone: Partial<IBuyer> = {phone: this._phoneElement.value}
      this._events.emit('phone:change', buyerPhone);
    });

  }

  set email(value: string) {
    this._emailElement.value = value;
  }

  set phone(value: string) {
    this._phoneElement.value = value;
  }

}