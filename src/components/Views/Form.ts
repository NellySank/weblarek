import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IFromAction {
  onClick?: () => void;
}

interface TForm {
  content: HTMLElement;
}

export class Form extends Component<TForm>{
  protected _formContentElement: HTMLElement;
  protected _submitButton: HTMLButtonElement;
  protected _errorsContainer: HTMLElement;

  constructor(container: HTMLElement, action?: IFromAction) {
    super(container);

    this._formContentElement = ensureElement<HTMLElement>('.order',this.container);
    this._errorsContainer = ensureElement<HTMLElement>('.form__errors',this.container);
    this._submitButton = ensureElement<HTMLButtonElement>('.order__button',this.container);

    if (action?.onClick) {
        this._submitButton.addEventListener('click', action?.onClick);
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