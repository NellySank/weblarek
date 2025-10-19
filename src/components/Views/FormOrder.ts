import { TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { TValidationErrors } from "../Models/Buyer";
import { Form } from "./Form";

interface TFormOrder {
  payment: TPayment;
  address: string;
}

export interface IFormAction {
  onSubmit?: () => void;
  validation?: () => void;
}

export class FormOrder extends Form {
  protected _buttonCardElement: HTMLButtonElement;
  protected _buttonCashElement: HTMLButtonElement;
  protected _inputAddresElement: HTMLInputElement;
  protected _payment: TPayment | null = null; 


  constructor(container: HTMLElement,  action?: IFormAction) {
    super(container);

    this._buttonCardElement = ensureElement<HTMLButtonElement>('.order__buttons button[name="card"]', this.container);
    this._buttonCashElement = ensureElement<HTMLButtonElement>('.order__buttons button[name="cash"]', this.container);
    this._inputAddresElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

      this._buttonCardElement.addEventListener('click', () => {
      this._payment = 'card';
      this._buttonCardElement.classList.remove('button_alt');
      this._buttonCardElement.classList.add('button_alt-active'); 

      this._buttonCashElement.classList.remove('button_alt-active');
      this._buttonCashElement.classList.add('button_alt'); 

      if (action?.validation) {
        action?.validation();
      }
    });

    this._buttonCashElement.addEventListener('click', () => {
      this._payment = 'cash';
      this._buttonCashElement.classList.remove('button_alt');
      this._buttonCashElement.classList.add('button_alt-active');

      this._buttonCardElement.classList.remove('button_alt-active');
      this._buttonCardElement.classList.add('button_alt');

      if (action?.validation) {
        action?.validation();
      }
    });

    this._inputAddresElement.addEventListener('input', () => {
    if (action?.validation) {
      action?.validation();
    }
    });

  }

}
  