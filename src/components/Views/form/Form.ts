import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface IFormAction {
  onSubmit?: (event: Event) => void;
}

interface IForm {
  content: HTMLElement;
  isDisableButton: boolean;
  error: string;
}

export class Form<IForm> extends Component<IForm>{
  protected _formContentElement: HTMLElement;
  protected _submitButton: HTMLButtonElement;
  protected _errorsContainer: HTMLElement;

  constructor(container: HTMLElement, actions?: IFormAction) {
    super(container);

    this._formContentElement = ensureElement<HTMLElement>('.order',this.container);
    this._errorsContainer = ensureElement<HTMLElement>('.form__errors',this.container);
    this._submitButton = ensureElement<HTMLButtonElement>('.modal__actions .button',this.container);

    if (actions?.onSubmit) {
      this.container.addEventListener('submit', actions.onSubmit);
    }
  }

  set error(value: string) {
    this._errorsContainer.textContent = value;
  }

  set content(orderData: HTMLElement ) {
    this._formContentElement.replaceChildren(orderData);
  }

  set isDisableButton(isDisable: boolean) {
    this._submitButton.disabled = isDisable;
  }
}