import { BaseElement } from './base-element';

export abstract class Page {
  private _page: BaseElement<HTMLDivElement>;

  constructor() {
    this._page = new BaseElement({ tag: 'div', className: 'page' });
  }

  public clear() {
    while (this._page.element.lastChild) {
      this._page.element.lastChild.remove();
    }
  }

  public get page() {
    return this._page.element;
  }
}
