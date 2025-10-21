import { IBuyer, TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, IFormAction } from "./Form";

export interface TFormOrder {
  payment: TPayment;
  address: string;
}

export class FormOrder extends Form<TFormOrder> {
  protected _buttonCardElement: HTMLButtonElement;
  protected _buttonCashElement: HTMLButtonElement;
  protected _inputAddressElement: HTMLInputElement;


  constructor(protected _events: IEvents, container: HTMLElement, actions?: IFormAction) {
     super(container, actions);

    this._buttonCardElement = ensureElement<HTMLButtonElement>('.order__buttons button[name="card"]', this.container);
    this._buttonCashElement = ensureElement<HTMLButtonElement>('.order__buttons button[name="cash"]', this.container);
    this._inputAddressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this._events = _events;

    this._buttonCardElement.addEventListener('click', () => {
      this.togglePaymentButtons(this._buttonCardElement);
      const buyerPayment: Partial<IBuyer> = { payment: this._buttonCardElement.name as TPayment };
      this._events.emit('payment:change', buyerPayment);
    });

    this._buttonCashElement.addEventListener('click', () => {
      this.togglePaymentButtons(this._buttonCashElement);
      const buyerPayment: Partial<IBuyer> = { payment: this._buttonCashElement.name as TPayment };
      this._events.emit('payment:change', buyerPayment);
    });

    this._inputAddressElement.addEventListener('input', () => {
      const buyerAddress: Partial<IBuyer> = { address: this._inputAddressElement.value };
      this._events.emit('address:change', buyerAddress);
    });

  }

   set payment(value: TPayment | undefined) {
    if (value === 'card') {
      this.togglePaymentButtons(this._buttonCardElement);
    } else if (value === 'cash') {
      this.togglePaymentButtons(this._buttonCashElement);
    } else {
      this.togglePaymentButtons(null);
    }
  }

  private togglePaymentButtons(activeButton: HTMLButtonElement | null = null): void {
    [this._buttonCardElement, this._buttonCashElement].forEach(btn => {
      if (btn === activeButton) {
        btn.classList.remove('button_alt');
        btn.classList.add('button_alt-active');
      } else {
        btn.classList.add('button_alt');
        btn.classList.remove('button_alt-active');
      }
    });
  }

  set address(value: string) {
    this._inputAddressElement.value = value;
  }

}
  