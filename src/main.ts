import './style.css';

import { Header } from './layout/header';
import { GaragePage } from './pages/garage';
import { HomePage } from './pages/home';
import { NotFoundPage } from './pages/not-found';
import { WinnersPage } from './pages/winners';
import { Router } from './router/router';

export class App {
  private _container: HTMLDivElement;
  private _content: HTMLElement;
  public _homePage: HomePage;
  public _garagePage: GaragePage;
  public _winnersPage: WinnersPage;
  public _notFoundPage: NotFoundPage;
  public router: Router;

  constructor() {
    this._container = document.createElement('div');
    this._content = document.createElement('main');
    this._homePage = new HomePage(this);
    this._garagePage = new GaragePage(this);
    this._winnersPage = new WinnersPage(this);
    this._notFoundPage = new NotFoundPage(this);

    this.router = new Router(this);
    this.view();
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
