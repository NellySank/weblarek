import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected _catalogElement: HTMLElement;

  constructor(protected _events: IEvents, container: HTMLElement) {
    super(container);

    this._catalogElement = ensureElement<HTMLElement>('.gallery', this.container);

  }

  set catalog(items: HTMLElement[]) {
    this._catalogElement.innerHTML = '';
    items.forEach((item) => {
      this._catalogElement.append(item);
    });
  }
}