import './style.css';

import { Header } from './layout/header';
import { GaragePage } from './pages/garage';
// import { GaragePage } from './pages/garage';
import { HomePage } from './pages/home';
// import { NotFoundPage } from './pages/not-found';
// import { WinnersPage } from './pages/winners';
import { PATH } from './router/path';
import { Router } from './router/router';

export type IRoutes = {
  path: string;
  page: () => void;
};

export class App {
  private _container: HTMLDivElement;
  private _content: HTMLElement;
  // public _homePage: HomePage;
  // public _garagePage: GaragePage;
  // public _winnersPage: WinnersPage;
  // public _notFoundPage: NotFoundPage;
  public router: Router;

  constructor() {
    this._container = document.createElement('div');
    this._content = document.createElement('main');
    this.view();

    // this._garagePage = new GaragePage(this);
    // this._winnersPage = new WinnersPage(this);
    // this._notFoundPage = new NotFoundPage(this);

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
      { path: PATH.GARAGE, page: () => this.showPage(new GaragePage().page) },
      // { path: PATH.WINNERS, page: () => this._winnersPage.view() },
      // { path: PATH.NOTFOUND, page: () => this._notFoundPage.view() },
    ];
  }

  private showPage(page: HTMLDivElement) {
    while (this._content.lastChild) {
      this._content.lastChild.remove();
    }

    this._content.append(page);
  }

  private view() {
    this._container.append(new Header().container, this._content);
    document.body.append(this._container);
  }

  get container() {
    return this._container;
  }

  get main() {
    return this._content;
  }
}

new App();
