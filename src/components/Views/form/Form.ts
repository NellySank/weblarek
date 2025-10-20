import { TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface IFormAction {
  onSubmit?: (event: Event) => void;
  validation?: () => void;
  setPayment?:(selectedPayment: TPayment) => void;
  setAddress?:(addressValue: string) => void;
  setEmail?:(emailValue: string) => void;
  setPhone?:(phoneValue: string) => void;
}

interface TForm {
  content: HTMLElement;
}

export class Form extends Component<TForm>{
  protected _formContentElement: HTMLElement;
  protected _submitButton: HTMLButtonElement;
  protected _errorsContainer: HTMLElement;

  constructor(container: HTMLElement, action?: IFormAction) {
    super(container);

    this._formContentElement = ensureElement<HTMLElement>('.order',this.container);
    this._errorsContainer = ensureElement<HTMLElement>('.form__errors',this.container);
    this._submitButton = ensureElement<HTMLButtonElement>('.modal__actions .button',this.container);

    if (action?.onSubmit) {
        this.container.addEventListener('submit', action.onSubmit);
    }
  }

  set error(value: string) {
    this._errorsContainer.textContent = value;
  }

  set content(orderData: HTMLElement ) {
    this._formContentElement.replaceChildren(orderData);
  }

   setDisableButton(isDisable: boolean) {
    this._submitButton.disabled = isDisable;
  }
}