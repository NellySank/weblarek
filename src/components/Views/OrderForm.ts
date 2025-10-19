import { TPayment } from "../../types";
import { EventEmitter } from "../base/Events";
import { TValidationErrors } from "../Models/Buyer";
import { Modal } from "./Modal";

export interface IOrderFormData {
    payment: TPayment;
    address: string;
    errors: TValidationErrors;
}

export class OrderForm extends Modal {
    private _paymentButtons: NodeListOf<HTMLButtonElement>;
    private _addressInput: HTMLInputElement;
    private _nextButton: HTMLButtonElement;
    private _errors: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);
        this._paymentButtons = this.content.querySelectorAll('.button_alt');
        this._addressInput = this.content.querySelector('input[name="address"]') as HTMLInputElement;
        this._nextButton = this.content.querySelector('.order__button') as HTMLButtonElement;
        this._errors = this.content.querySelector('.form__errors') as HTMLElement;

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                events.emit('order:payment', { payment: button.name as TPayment });
            });
        });
        this._addressInput.addEventListener('input', () => {
            events.emit('order:address', { address: this._addressInput.value });
        });
        this._nextButton.addEventListener('click', () => {
            events.emit('order:next');
        });
    }

    render(data: IOrderFormData): HTMLElement {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === data.payment);
        });
        this._addressInput.value = data.address;
        this._errors.textContent = Object.values(data.errors).join('; ');
        this._nextButton.disabled = !data.payment || !data.address.trim() || Object.keys(data.errors).length > 0;
        return super.render({ content: this.content });
    }
}