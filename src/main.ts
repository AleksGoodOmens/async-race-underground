import './style.css';

import { BaseElement } from './base/base-element';
import { Header } from './layout/header';
import { GaragePage } from './pages/garage';
import { HomePage } from './pages/home';
import { NotFoundPage } from './pages/not-found';
import { WinnersPage } from './pages/winners';
import { PATH } from './router/path';
import { Router } from './router/router';

export type IRoutes = {
  path: string;
  page: () => void;
};

export class App {
  private _container: BaseElement<HTMLDivElement>;
  private _content: BaseElement<HTMLDivElement>;
  public router: Router;

  constructor() {
    this._container = new BaseElement<HTMLDivElement>({
      tag: 'div',
      className: 'app',
    });
    this._content = new BaseElement<HTMLDivElement>({
      tag: 'div',
      className: 'main',
    });
    this.view();

    this.router = new Router(this.createRoutes());
  }

  private createRoutes(): IRoutes[] {
    return [
      {
        path: PATH.HOME,
        page: () =>
          this.showPage(
            new HomePage(() => this.router.navigate(PATH.GARAGE)).page
          ),
      },
      {
        path: PATH.GARAGE,
        page: () =>
          this.showPage(
            new GaragePage(() => this.router.navigate(PATH.WINNERS)).page
          ),
      },
      {
        path: PATH.WINNERS,
        page: () =>
          this.showPage(
            new WinnersPage(() => this.router.navigate(PATH.GARAGE)).page
          ),
      },
      {
        path: PATH.NOTFOUND,
        page: () =>
          this.showPage(
            new NotFoundPage(() => this.router.navigate(PATH.HOME)).page
          ),
      },
    ];
  }

  private showPage(page: HTMLDivElement) {
    while (this._content.element.lastChild) {
      this._content.element.lastChild.remove();
    }

    this._content.append(page);
  }

  private view() {
    this._container.append(new Header().container, this._content.element);
    document.body.append(this._container.element);
  }

  get container() {
    return this._container;
  }

  get main() {
    return this._content;
  }
}

new App();
