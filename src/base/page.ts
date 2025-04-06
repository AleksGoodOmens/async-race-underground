export abstract class Page {
  private _page: HTMLDivElement;

  constructor() {
    this._page = document.createElement('div');
  }

  public clear() {
    while (this._page.firstChild) {
      this._page.firstChild.remove();
    }
  }

  public get page() {
    return this._page;
  }
}
