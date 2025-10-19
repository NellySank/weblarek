import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface ISuccessPageData {
    total: number;
}

export class SuccessPage extends Component<ISuccessPageData> {
    private _descriptionElement: HTMLElement;
    private _actionButtonElement: HTMLButtonElement;

    constructor(protected _events: IEvents, container: HTMLElement) {
        super(container);

        this._descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._actionButtonElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);


        this._actionButtonElement.addEventListener('click', () => {
            this._events.emit('success:close');
        });
    }

    set total (value: number) {
      this._descriptionElement.textContent = String(value);
    }

}