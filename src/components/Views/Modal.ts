import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    private _contentElement: HTMLElement;
    private _closeButtonElement: HTMLButtonElement;
    private _containerElement: HTMLElement;

    constructor(protected _events: IEvents, container: HTMLElement) {
        super(container);

        this._containerElement = container.querySelector('.modal__container') as HTMLElement;
        this._closeButtonElement = container.querySelector('.modal__close') as HTMLButtonElement;
        this._contentElement = container.querySelector('.modal__content') as HTMLElement;

        this.container.addEventListener('click', () => this.close());
        this._containerElement.addEventListener('click', (e) => e.stopPropagation());
        this._closeButtonElement.addEventListener('click', () => this.close());
    }

    set content(value: HTMLElement) {
        this._contentElement.replaceChildren(value);
    }

    get content(): HTMLElement {
        return this._contentElement;
    }
    
    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
        this._events.emit('modal:close');
    }
}