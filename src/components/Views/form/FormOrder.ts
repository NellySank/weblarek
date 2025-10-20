import { TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Form, IFormAction } from "./Form";

interface TFormOrder {
  payment: TPayment;
  address: string;
}

export class FormOrder extends Form {
  protected _buttonCardElement: HTMLButtonElement;
  protected _buttonCashElement: HTMLButtonElement;
  protected _inputAddressElement: HTMLInputElement;


  constructor(container: HTMLElement,  action?: IFormAction, ) {
    super(container, action);

    this._buttonCardElement = ensureElement<HTMLButtonElement>('.order__buttons button[name="card"]', this.container);
    this._buttonCashElement = ensureElement<HTMLButtonElement>('.order__buttons button[name="cash"]', this.container);
    this._inputAddressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

      this._buttonCardElement.addEventListener('click', () => {
        this._buttonCardElement.classList.remove('button_alt');
        this._buttonCardElement.classList.add('button_alt-active'); 

        this._buttonCashElement.classList.remove('button_alt-active');
        this._buttonCashElement.classList.add('button_alt'); 

        if (action?.setPayment) {
         action?.setPayment('card');
        }
    });

    this._buttonCashElement.addEventListener('click', () => {
      this._buttonCashElement.classList.remove('button_alt');
      this._buttonCashElement.classList.add('button_alt-active');

      this._buttonCardElement.classList.remove('button_alt-active');
      this._buttonCardElement.classList.add('button_alt');

       if (action?.setPayment) {
         action?.setPayment('cash');
        }
    });

    this._inputAddressElement.addEventListener('input', () => {
      if (action?.setAddress) {

        action?.setAddress(this._inputAddressElement.value);
      }
    });

  }

}
  