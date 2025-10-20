import { ensureElement } from "../../../utils/utils";
import { Form, IFormAction } from "./Form";

export class FormContact extends Form {
  protected _emailElement: HTMLInputElement;
  protected _phoneElement: HTMLInputElement;

  constructor(container: HTMLElement, action?: IFormAction) {
    super(container, action);

    this._emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this._phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);


    this._emailElement.addEventListener('input', () => {
      if (action?.setEmail) {
          action?.setEmail();
      }
    });

    this._phoneElement.addEventListener('input', () => {
      if (action?.setPhone) {
          action?.setPhone();
      }
    });


  }
}