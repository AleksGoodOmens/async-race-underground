import { App } from '../main';

export abstract class Page {
  public page: HTMLDivElement;
  public _app: App;

  constructor(app: App) {
    this.page = document.createElement('div');
    this._app = app;
  }

  public abstract view(): void;

  public clear() {
    while (this._app.main.firstChild) {
      this._app.main.firstChild.remove();
    }

    while (this.page.firstChild) {
      this.page.firstChild.remove();
    }
  }
}
